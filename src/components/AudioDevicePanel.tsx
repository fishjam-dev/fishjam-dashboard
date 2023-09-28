import { FaMicrophone } from "react-icons/fa";
import { getUserMedia } from "../utils/browser-media-utils";
import { DeviceInfo } from "../containers/StreamingSettingsCard";

type AudioDevicePanelProps = {
  deviceId: string;
  label: string;
  addLocalAudioStream: (stream: MediaStream, id: string) => void;
  setSelectedAudioId: (cameraId: DeviceInfo | null) => void;
  selected: boolean;
};
export const AudioDevicePanel = ({
  deviceId,
  label,
  addLocalAudioStream,
  setSelectedAudioId,
}: AudioDevicePanelProps) => (
  <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center indicator">
    <button
      className="btn btn-success btn-sm m-2"
      onClick={() => {
        const id = deviceId + crypto.randomUUID();
        getUserMedia(id, "audio").then((stream) => {
          setSelectedAudioId({ id: id, type: "audio", stream: stream });
          addLocalAudioStream(stream, id);
        });
      }}
    >
      Start
      <FaMicrophone className="ml-2" size="20" />
    </button>
    <div className="p-1">{label}</div>
  </div>
);
