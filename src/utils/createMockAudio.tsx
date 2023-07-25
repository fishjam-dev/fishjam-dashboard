export const createMockAudio: () => {
  stop: () => void;
  stream: MediaStream;
} = () => {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = 440;
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.1;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  return {
    stream: audioContext.createMediaStreamDestination().stream,
    stop: () => {
      oscillator.stop();
    },
  };
};
