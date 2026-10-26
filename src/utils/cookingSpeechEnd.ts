/** End one utterance after 1.2 seconds of quiet, with a short noise rejection window. */
export function createSpeechEndDetector() {
  let voiceMs = 0;
  let quietMs = 0;
  let elapsedMs = 0;
  return (rms: number, deltaMs: number): 'listening' | 'finished' | 'empty' => {
    const elapsed = Math.max(0, Math.min(deltaMs, 250));
    elapsedMs += elapsed;
    if (rms >= 0.012) { voiceMs += elapsed; quietMs = 0; }
    else quietMs += elapsed;
    if (voiceMs >= 250 && quietMs >= 1200) return 'finished';
    if (voiceMs < 250 && elapsedMs >= 6000) return 'empty';
    return 'listening';
  };
}

export function watchCookingSpeech(stream: MediaStream, onFinished: () => void, onEmpty: () => void): () => void {
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return () => {};
  const context = new AudioContextClass();
  let source: MediaStreamAudioSourceNode | undefined;
  let analyser: AnalyserNode | undefined;
  let interval: ReturnType<typeof setInterval> | undefined;
  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (interval) clearInterval(interval);
    source?.disconnect();
    analyser?.disconnect();
    void context.close().catch(() => {});
  };
  try {
    source = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);
    const detect = createSpeechEndDetector();
    let previous = performance.now();
    // Keep the manual stop/15-second limit when a browser cannot run the analyser.
    void context.resume().catch(stop);
    interval = setInterval(() => {
      if (context.state !== 'running' || stopped) return;
      const now = performance.now();
      analyser!.getFloatTimeDomainData(samples);
      let energy = 0;
      for (const value of samples) energy += value * value;
      const result = detect(Math.sqrt(energy / samples.length), now - previous);
      previous = now;
      if (result === 'listening') return;
      stop();
      if (result === 'finished') onFinished(); else onEmpty();
    }, 100);
  } catch { stop(); }
  return stop;
}
