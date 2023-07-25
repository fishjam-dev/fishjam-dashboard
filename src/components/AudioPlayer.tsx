import { FaMicrophone } from "react-icons/fa";

type AudioProps = {
  stream: MediaStream | null;
  size?: string;
};

export const AudioPlayer = ({ stream, size = "50" }: AudioProps) => {
  return (
    <div className="flex flex-1 flex-row flex-wrap justify-between items-center bg-gray-200 w-min h-min rounded-md">
      <audio autoPlay={true} ref={(ref) => (ref ? (ref.srcObject = stream) : null)} />
      <FaMicrophone size={size} />
    </div>
  );
};
