// Chrome exposes the prefixed Web Speech API; other browsers may expose neither.
export interface CookingRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
export type CookingRecognitionConstructor = new () => CookingRecognition;
export function cookingRecognitionConstructor(): CookingRecognitionConstructor | undefined {
  const host = window as unknown as { SpeechRecognition?: CookingRecognitionConstructor; webkitSpeechRecognition?: CookingRecognitionConstructor };
  return host.SpeechRecognition || host.webkitSpeechRecognition;
}

/** Deliver final text once, after the microphone ends; cancellation never submits. */
export function listenCookingCommand(Recognition: CookingRecognitionConstructor, callbacks: {
  onStart(): void; onTranscript(text: string): void; onText(text: string): void; onError(message: string): void;
}) {
  const recognition = new Recognition();
  recognition.lang = 'vi-VN';
  recognition.continuous = false;
  recognition.interimResults = true;
  let finished = false;
  let finalText = '';
  let stopTimer: ReturnType<typeof setTimeout> | undefined;
  const dispose = () => {
    clearTimeout(limit);
    clearTimeout(stopTimer);
    recognition.onstart = recognition.onresult = recognition.onerror = recognition.onend = null;
  };
  const fail = (message: string) => {
    if (finished) return;
    finished = true; dispose(); recognition.abort(); callbacks.onError(message);
  };
  const stop = () => {
    if (finished || stopTimer) return;
    stopTimer = setTimeout(() => fail('Nhận giọng nói chưa kết thúc. Hãy thử lại hoặc nhập câu hỏi.'), 5000);
    recognition.stop();
  };
  const limit = setTimeout(stop, 15000);
  recognition.onstart = callbacks.onStart;
  recognition.onresult = event => {
    if (finished) return;
    const results = Array.from(event.results);
    finalText = results.filter(result => result.isFinal).map(result => result[0].transcript).join(' ').trim();
    callbacks.onTranscript(results.map(result => result[0].transcript).join(' ').trim());
    if (finalText) stop();
  };
  recognition.onerror = event => fail(event.error === 'not-allowed' || event.error === 'service-not-allowed'
    ? 'Chưa được cấp quyền nhận giọng nói. Hãy cho phép micro hoặc nhập câu hỏi.'
    : event.error === 'no-speech' ? 'Chưa nghe rõ lời nói. Hãy nói gần micro rồi thử lại.'
    : event.error === 'audio-capture' ? 'Không thu được âm thanh. Hãy kiểm tra micro.'
    : 'Không kết nối được nhận giọng nói của trình duyệt. Bạn có thể thử lại, dùng ghi âm dự phòng hoặc nhập câu hỏi.');
  recognition.onend = () => {
    if (finished) return;
    finished = true; dispose();
    if (finalText) callbacks.onText(finalText);
    else callbacks.onError('Chưa nghe rõ lời nói. Hãy nói gần micro rồi thử lại.');
  };
  try { recognition.start(); } catch (error) { dispose(); throw error; }
  return {
    stop,
    cancel() { if (!finished) { finished = true; dispose(); recognition.abort(); } },
  };
}
