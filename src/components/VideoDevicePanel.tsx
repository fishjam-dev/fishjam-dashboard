import { AiOutlineCamera } from "react-icons/ai";
import { getUserMedia } from "../utils/browser-media-utils";
import { DeviceInfo } from "../containers/StreamingSettingsCard";
import { v4 as uuidv4 } from "uuid";
type VideoDevicePanelProps = {
  deviceId: string;
  label: string;
  addLocalVideoStream: (stream: MediaStream, id: string) => void;
  setSelectedVideoId: (cameraId: DeviceInfo | null) => void;
  selected: boolean;
};
export const VideoDevicePanel = ({
  deviceId,
  label,
  addLocalVideoStream,
  setSelectedVideoId,
}: VideoDevicePanelProps) => (
  <div className="flex w-full flex-row flex-1 items-center gap-2">
    <button
      className="btn btn-success btn-sm"
      onClick={() => {
        const id = deviceId + uuidv4();
        getUserMedia(deviceId, "video").then((stream) => {
          setSelectedVideoId({ id: id, type: "video", stream: stream });
          addLocalVideoStream(stream, id);
        });
      }}
    >
      Start
      <AiOutlineCamera className="ml-2" size="25" />
    </button>
    <div className="p-1">{label}</div>
  </div>
);
