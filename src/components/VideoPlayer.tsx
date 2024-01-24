import { CSSProperties, useCallback } from "react";

type Props = {
  stream: MediaStream | null | undefined;
  size?: string;
  innerStyles?: CSSProperties;
};

const VideoPlayer = ({ stream, innerStyles, size = "52" }: Props) => {
  const loadVideo = useCallback(
    (media: HTMLAudioElement | null) => {
      if (!media) return;
      media.srcObject = stream || null;
    },
    [stream],
  );

  return (
    <video
      className={`flex-1 w-${size} h-fit rounded-md`}
      style={innerStyles}
      autoPlay
      playsInline
      controls={false}
      muted
      ref={loadVideo}
    />
  );
};

export default VideoPlayer;
