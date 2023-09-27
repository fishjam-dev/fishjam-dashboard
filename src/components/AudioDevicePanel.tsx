import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import { FaMicrophone } from "react-icons/fa";
import { getUserMedia } from "../utils/browser-media-utils";
import { DeviceInfo } from "../containers/StreamingCard";

type AudioTileProps = {
  activeStreams: DeviceIdToStream | null;
  deviceId: string;
  label: string;
  setActiveAudioStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;
  setSelectedAudioId: (cameraId: DeviceInfo | null) => void;
  selected: boolean;
  streamInfo: StreamInfo | null;
};
export const AudioDevicePanel = ({ deviceId, label, setActiveAudioStreams, setSelectedAudioId }: AudioTileProps) => (
  <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center indicator">
    <button
      className="btn btn-success btn-sm m-2"
      onClick={() => {
        const id = deviceId + crypto.randomUUID();
        getUserMedia(id, "audio").then((stream) => {
          setSelectedAudioId({ id: id, type: "audio", stream: stream });
          setActiveAudioStreams((prev) => {
            return {
              ...prev,
              [id]: {
                stream,
                id: id,
              },
            };
          });
        });
      }}
    >
      Start
      <FaMicrophone className="ml-2" size="20" />
    </button>
    <div className="p-1">{label}</div>
  </div>
);
