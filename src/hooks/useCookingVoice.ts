import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { cookingVoiceApi } from '../api/cookingVoice.api';
import type { CookingVoiceReply, CookingVoiceRequest } from '../api/cookingVoice.api';
import { getCookingScopeReply } from '../utils/cookingScope';
import { audioBlobBase64, prepareCookingAudio, recordingMimeType } from '../utils/cookingVoiceBrowser';
import { watchCookingSpeech } from '../utils/cookingSpeechEnd';
import { cookingRecognitionConstructor, listenCookingCommand } from '../utils/cookingRecognition';
import { cookingStepAnnouncement } from '../utils/cookingStepSpeech';
import { parseRecipeVideoCommand, type RecipeVideoCommand } from '../utils/recipeVideoCommands';

type Phase = 'idle' | 'permission' | 'recording' | 'transcribing' | 'thinking';
type Context = Omit<CookingVoiceRequest, 'userVoiceText' | 'conversationHistory'>;

export function useCookingVoice(context: Context, recipeId: string, onAction: (reply: CookingVoiceReply) => void, cookingActive = false, onVideoCommand?: (command: RecipeVideoCommand) => string) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readReplies, setReadReplies] = useState(true);
  const [quickReplies, setQuickReplies] = useState(['Đọc lại', 'Đang ở bước nào?', 'Thêm 2 phút']);
  const latest = useRef({ context, onAction, readReplies, onVideoCommand });
  useEffect(() => { latest.current = { context, onAction, readReplies, onVideoCommand }; }, [context, onAction, readReplies, onVideoCommand]);
  const session = useRef(0);
  const busy = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const limitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopSpeechMonitor = useRef<(() => void) | null>(null);
  const history = useRef<NonNullable<CookingVoiceRequest['conversationHistory']>>([]);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const navigationReply = useRef(false);
  const recognition = useRef<ReturnType<typeof listenCookingCommand> | null>(null);
  const announcedStep = useRef<number | undefined>(undefined);

  const releaseMicrophone = useCallback(() => {
    stopSpeechMonitor.current?.();
    stopSpeechMonitor.current = null;
    if (limitTimer.current) clearTimeout(limitTimer.current);
    limitTimer.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);

  const stopSpeech = useCallback(() => {
    if (utterance.current) {
      utterance.current.onstart = null;
      utterance.current.onend = null;
      utterance.current.onerror = null;
      utterance.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    stopSpeech();
    if (!('speechSynthesis' in window)) {
      setError('Trình duyệt không hỗ trợ đọc giọng nói. Bạn vẫn có thể xem câu trả lời bên dưới.');
      return;
    }
    const speech = new SpeechSynthesisUtterance(text.replace(/[#*_`]/g, '').trim());
    speech.lang = 'vi-VN';
    speech.rate = 0.95;
    const vietnamese = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('vi'));
    if (vietnamese) speech.voice = vietnamese;
    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => { setIsSpeaking(false); utterance.current = null; };
    speech.onerror = (event) => {
      setIsSpeaking(false);
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        setError('Chưa phát được giọng đọc. Hãy bấm “Nghe lại” và kiểm tra âm lượng.');
      }
    };
    utterance.current = speech;
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(speech);
  }, [stopSpeech]);

  const cancelSession = useCallback((preserveReplySpeech = false) => {
    session.current += 1;
    controller.current?.abort();
    controller.current = null;
    recognition.current?.cancel();
    recognition.current = null;
    if (recorder.current) {
      recorder.current.onstop = null;
      recorder.current.ondataavailable = null;
      recorder.current.onerror = null;
      if (recorder.current.state !== 'inactive') recorder.current.stop();
      recorder.current = null;
    }
    releaseMicrophone();
    if (!preserveReplySpeech) stopSpeech();
    busy.current = false;
    setPhase('idle');
  }, [releaseMicrophone, stopSpeech]);

  const cancel = useCallback(() => {
    navigationReply.current = false;
    cancelSession();
  }, [cancelSession]);

  useEffect(() => {
    history.current = [];
    return () => { cancelSession(); };
  }, [recipeId, cancelSession]);

  useEffect(() => {
    const previous = announcedStep.current;
    const preserveReplySpeech = navigationReply.current;
    navigationReply.current = false;
    cancelSession(preserveReplySpeech);
    history.current = [];
    if (!cookingActive) { announcedStep.current = undefined; return; }
    announcedStep.current = context.currentStep.stepNumber;
    if (preserveReplySpeech) return;
    const message = cookingStepAnnouncement(latest.current.context.currentStep, previous);
    setTranscript(''); setReply(message); setError('');
    setQuickReplies(['Đọc lại', 'Lùi bước', 'Bước tiếp theo']);
    if (latest.current.readReplies) speak(message);
    // Timer ticks and voice preference changes must not restart an announcement.
  }, [recipeId, context.currentStep.stepNumber, cookingActive, cancelSession, speak]);

  const showError = (err: unknown) => {
    if (axios.isAxiosError(err)) setError(err.response?.data?.message || 'Chưa kết nối được trợ lý. Hãy thử lại.');
    else setError(err instanceof Error ? err.message : 'Không xử lý được yêu cầu. Hãy thử lại.');
  };

  const ask = async (text: string, token: number, requestController: AbortController) => {
    if (token !== session.current) return;
    const request = { ...latest.current.context, userVoiceText: text, conversationHistory: history.current };
    setTranscript(text);
    setReply('');
    setQuickReplies([]);
    setError('');
    setPhase('thinking');
    const videoCommand = latest.current.onVideoCommand && parseRecipeVideoCommand(text);
    if (videoCommand && latest.current.onVideoCommand) {
      const message = latest.current.onVideoCommand(videoCommand);
      setReply(message);
      setQuickReplies(['Mở video hướng dẫn', 'Tua tới 30 giây', 'Tạm dừng video']);
      if (latest.current.readReplies) speak(message);
      return;
    }
    const answer = await cookingVoiceApi.ask(request, requestController.signal);
    if (token !== session.current) return;
    setReply(answer.speechReply);
    setQuickReplies(answer.suggestedQuickReplies ?? ['Đọc lại', 'Lùi bước', 'Thêm 2 phút']);
    if (!getCookingScopeReply(text, request)) {
      history.current = [...history.current, { role: 'user' as const, text: text.slice(0, 350) },
        { role: 'assistant' as const, text: answer.speechReply.slice(0, 350) }].slice(-6);
    }
    navigationReply.current = ['GO_TO_STEP', 'NEXT_STEP', 'PREV_STEP'].includes(answer.action);
    latest.current.onAction(answer);
    if (latest.current.readReplies) speak(answer.speechReply);
  };

  const send = async (input: string) => {
    if (busy.current) return;
    const text = input.trim();
    if (!text) return;
    if (text.length > 600) { setError('Bạn hãy hỏi ngắn gọn, tối đa 600 ký tự nhé.'); return; }
    busy.current = true;
    stopSpeech();
    const token = session.current;
    const requestController = new AbortController();
    controller.current = requestController;
    try { await ask(text, token, requestController); }
    catch (err) { if (token === session.current && !requestController.signal.aborted) showError(err); }
    finally { if (token === session.current) { busy.current = false; setPhase('idle'); } }
  };

  const stopRecording = () => {
    if (recognition.current) { setPhase('transcribing'); recognition.current.stop(); return; }
    if (limitTimer.current) clearTimeout(limitTimer.current);
    limitTimer.current = null;
    if (recorder.current?.state === 'recording') {
      setPhase('transcribing');
      recorder.current.stop();
    }
  };

  const startRecording = async (useRecorder = false) => {
    if (busy.current) return;
    const Recognition = !useRecorder && cookingRecognitionConstructor();
    if (Recognition) {
      busy.current = true;
      stopSpeech(); setError(''); setTranscript(''); setPhase('permission');
      const token = session.current;
      const requestController = new AbortController();
      controller.current = requestController;
      try {
        recognition.current = listenCookingCommand(Recognition, {
          onStart: () => { if (token === session.current) setPhase('recording'); },
          onTranscript: text => { if (token === session.current) setTranscript(text); },
          onText: async text => {
            recognition.current = null;
            if (token !== session.current) return;
            try { await ask(text, token, requestController); }
            catch (err) { if (token === session.current && !requestController.signal.aborted) showError(err); }
            finally { if (token === session.current) { busy.current = false; setPhase('idle'); } }
          },
          onError: message => {
            recognition.current = null;
            if (token === session.current) { busy.current = false; setPhase('idle'); setError(message); }
          },
        });
      } catch (err) {
        busy.current = false; setPhase('idle'); showError(err);
      }
      return;
    }
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError('Micro cần HTTPS hoặc localhost. Bạn có thể nhập câu hỏi bên dưới.'); return;
    }
    if (typeof MediaRecorder === 'undefined') {
      setError('Trình duyệt chưa hỗ trợ ghi âm. Bạn có thể nhập câu hỏi bên dưới.'); return;
    }
    busy.current = true;
    setError('');
    setPhase('permission');
    stopSpeech();
    const token = session.current;
    const requestController = new AbortController();
    controller.current = requestController;
    try {
      const captured = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      if (token !== session.current) { captured.getTracks().forEach((track) => track.stop()); return; }
      stream.current = captured;
      const mimeType = recordingMimeType((mime) => MediaRecorder.isTypeSupported(mime));
      if (!mimeType) throw new Error('Trình duyệt chưa hỗ trợ định dạng ghi âm. Hãy nhập câu hỏi.');
      const capture = new MediaRecorder(captured, { mimeType, audioBitsPerSecond: 64000 });
      recorder.current = capture;
      const chunks: Blob[] = [];
      let bytes = 0;
      capture.ondataavailable = (event) => {
        if (event.data.size) { chunks.push(event.data); bytes += event.data.size; }
        if (bytes > 2_000_000 && capture.state === 'recording') capture.stop();
      };
      capture.onerror = () => { cancel(); setError('Không ghi được âm thanh. Hãy kiểm tra micro và thử lại.'); };
      capture.onstop = async () => {
        releaseMicrophone();
        recorder.current = null;
        if (token !== session.current) return;
        setPhase('transcribing');
        try {
          const audio = await prepareCookingAudio(new Blob(chunks, { type: capture.mimeType }));
          const audioBase64 = await audioBlobBase64(audio);
          if (token !== session.current) return;
          const text = await cookingVoiceApi.transcribe(audioBase64, audio.type, requestController.signal);
          if (token === session.current) await ask(text, token, requestController);
        } catch (err) {
          if (token === session.current && !requestController.signal.aborted) showError(err);
        } finally {
          if (token === session.current) { busy.current = false; setPhase('idle'); }
        }
      };
      capture.start(1000);
      setPhase('recording');
      try {
        stopSpeechMonitor.current = watchCookingSpeech(captured, () => {
          if (token === session.current && capture.state === 'recording') {
            setPhase('transcribing');
            capture.stop();
          }
        }, () => {
          if (token !== session.current) return;
          cancel();
          setError('Chưa nghe thấy câu hỏi. Bạn hãy nói gần micro hơn rồi thử lại.');
        });
      } catch { /* Recording and manual stop remain available if analysis is unsupported. */ }
      limitTimer.current = setTimeout(() => {
        if (capture.state === 'recording') { setPhase('transcribing'); capture.stop(); }
      }, 15000);
    } catch (err) {
      if (token !== session.current) return;
      releaseMicrophone();
      busy.current = false;
      setPhase('idle');
      setError(err instanceof DOMException && err.name === 'NotAllowedError'
        ? 'Chưa được cấp quyền micro. Hãy cho phép trong cài đặt trang hoặc nhập câu hỏi.'
        : err instanceof DOMException && err.name === 'NotFoundError'
        ? 'Không tìm thấy micro trên thiết bị. Bạn có thể nhập câu hỏi.'
        : err instanceof Error ? err.message : 'Không bật được micro. Hãy thử lại.');
    }
  };

  return { phase, transcript, reply, error, isSpeaking, readReplies, quickReplies,
    setReadReplies, send, startRecording, stopRecording, cancel, speak, stopSpeech };
}
