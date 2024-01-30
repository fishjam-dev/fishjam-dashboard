import MockVideoWorker from "./mockVideoWorker.ts?worker";

export type Quality = "low" | "medium" | "high";

export const createStream: (
  emoji: string,
  backgroundColor: string,
  quality: Quality,
  frameRate: number,
) => {
  stop: () => void;
  stream: MediaStream;
} = (emoji: string, backgroundColor: string, quality: Quality, frameRate: number) => {
  const worker = new MockVideoWorker();
  const canvasElement = document.createElement("canvas");
  const canvasWorker = canvasElement.transferControlToOffscreen();
  worker.postMessage(
    {
      action: "start",
      canvas: canvasWorker,
      emoji,
      backgroundColor,
      quality,
      frameRate,
    },
    [canvasWorker],
  );

  return {
    stream: canvasElement.captureStream(frameRate),
    stop: () => {
      worker.terminate();
    },
  };
};
