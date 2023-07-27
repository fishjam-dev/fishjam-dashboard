import { FaMicrophone } from "react-icons/fa";
import { RefObject, useEffect, useRef } from "react";

type AudioProps = {
  stream: MediaStream | null;
  size?: string;
  muted?: boolean;
};

export const AudioPlayer = ({ stream, size = "50", muted }: AudioProps) => {
  return (
    <div className="flex flex-1 flex-row flex-wrap justify-between items-center bg-gray-200 w-min h-min rounded-md">
      <audio autoPlay={true} muted={muted} ref={(ref) => (ref ? (ref.srcObject = stream) : null)} />
      <FaMicrophone size={size} />
    </div>
  );
};
