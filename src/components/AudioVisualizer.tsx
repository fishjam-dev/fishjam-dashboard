import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  stream: MediaStream | null;
  muted?: boolean;
  size?: number;
  height?: number;
};

export const AudioVisualizer = ({ stream, muted = false, size = 46, height = 100 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(size * 4);

  useEffect(() => {
    setCanvasWidth(canvasParentRef?.current?.clientWidth || 400);
  }, [canvasParentRef?.current?.clientWidth]);

  const loadAudio = useCallback(
    (media: HTMLAudioElement | null) => {
      if (!media) return;
      media.srcObject = stream || null;
    },
    [stream],
  );

  useEffect(() => {
    if (!stream) return;
    if (!canvasRef.current) return;

    const audioContext = new AudioContext();
    if (stream.getAudioTracks().length === 0) return;
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    const canvas = canvasRef.current;
    const canvasContext: CanvasRenderingContext2D = canvas.getContext("2d") || new CanvasRenderingContext2D();

    mediaStreamSource.connect(analyser);

    analyser.fftSize = 64;

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
      const id = requestAnimationFrame(renderFrame);
      if (!canvasRef.current) {
        cancelAnimationFrame(id);
        return;
      }

      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;

      let x = 0;

      analyser.getByteFrequencyData(dataArray);

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] * 50) / 256;
        canvasContext.fillStyle = "#000000";
        canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    renderFrame();
  }, [stream]);

  return (
    <div ref={canvasParentRef} className="flex flex-row flex-nowrap justify-center border-4 rounded-md bg-gray-200">
      <audio autoPlay={true} ref={loadAudio} muted={muted} />
      <canvas ref={canvasRef} width={canvasWidth} height={height} />
    </div>
  );
};

export default AudioVisualizer;
