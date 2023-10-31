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
  <div className="flex w-full flex-row flex-1 items-center gap-2">
    <button
      className="btn btn-success btn-sm"
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
