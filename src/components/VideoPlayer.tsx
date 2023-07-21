import { CSSProperties, RefObject, useEffect, useRef } from "react";

type Props = {
  stream: MediaStream | null | undefined;
  size?: string;
  innerStyles?: CSSProperties;
};

const VideoPlayer = ({ stream, innerStyles, size = "52" }: Props) => {
  const videoRef: RefObject<HTMLVideoElement> = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream || null;
  }, [stream]);

  return (
    <video
      className={` w-${size} rounded-md`}
      style={innerStyles}
      autoPlay
      playsInline
      controls={false}
      muted
      ref={videoRef}
    />
  );
};

export default VideoPlayer;
