export function recordingMimeType(supported: (mime: string) => boolean): string | undefined {
  return ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find(supported);
}

export function recordingBaseMimeType(mime: string): string {
  const base = mime.split(';')[0].trim().toLowerCase();
  if (!['audio/webm', 'audio/mp4', 'audio/m4a', 'audio/wav'].includes(base)) {
    throw new Error('Trình duyệt chưa hỗ trợ định dạng ghi âm này. Bạn có thể nhập câu hỏi.');
  }
  return base;
}

export function audioBlobBase64(blob: Blob): Promise<string> {
  if (!blob.size) return Promise.reject(new Error('Chưa thu được âm thanh. Hãy thử lại.'));
  if (blob.size > 2_000_000) return Promise.reject(new Error('Bản ghi quá dài. Hãy nói ngắn gọn trong 15 giây.'));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được bản ghi âm.'));
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.readAsDataURL(blob);
  });
}

/** Convert browser-dependent codecs to a complete mono PCM WAV at 16 kHz. */
export function encodeCookingWav(channels: readonly Float32Array[], sampleRate: number): ArrayBuffer {
  const frames = channels[0]?.length || 0;
  if (!frames || !Number.isFinite(sampleRate) || sampleRate <= 0 || channels.some((channel) => channel.length !== frames)) {
    throw new Error('Bản ghi âm chưa hợp lệ. Hãy ghi lại câu hỏi.');
  }
  if (frames / sampleRate > 20) throw new Error('Bản ghi quá dài. Hãy nói ngắn gọn trong 15 giây.');
  const outputRate = 16000;
  const length = Math.max(1, Math.round(frames * outputRate / sampleRate));
  const wav = new ArrayBuffer(44 + length * 2);
  const view = new DataView(wav);
  const text = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
  text(0, 'RIFF'); view.setUint32(4, 36 + length * 2, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, outputRate, true); view.setUint32(28, outputRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, length * 2, true);
  for (let index = 0; index < length; index++) {
    const position = index * sampleRate / outputRate;
    const left = Math.min(frames - 1, Math.floor(position));
    const right = Math.min(frames - 1, left + 1);
    const fraction = position - left;
    let value = 0;
    for (const channel of channels) value += channel[left] * (1 - fraction) + channel[right] * fraction;
    value = Math.max(-1, Math.min(1, value / channels.length));
    view.setInt16(44 + index * 2, Math.round(value * (value < 0 ? 32768 : 32767)), true);
  }
  return wav;
}

export async function prepareCookingAudio(blob: Blob): Promise<Blob> {
  if (!blob.size || blob.size > 2_000_000) throw new Error('Bản ghi trống hoặc quá dài. Hãy ghi lại câu hỏi.');
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) throw new Error('Trình duyệt chưa xử lý được âm thanh. Hãy nhập câu hỏi hoặc đổi trình duyệt.');
  const context = new AudioContextClass();
  try {
    const audio = await context.decodeAudioData(await blob.arrayBuffer());
    const channels = Array.from({ length: audio.numberOfChannels }, (_, index) => audio.getChannelData(index));
    return new Blob([encodeCookingWav(channels, audio.sampleRate)], { type: 'audio/wav' });
  } catch (error) {
    if (error instanceof DOMException) throw new Error('Không đọc được bản ghi âm. Hãy nói lại và bấm “Dừng và gửi” khi nói xong.');
    throw error;
  } finally {
    await context.close().catch(() => {});
  }
}
