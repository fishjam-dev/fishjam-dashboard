import { AiOutlineCamera } from "react-icons/ai";
import { getUserMedia } from "../utils/browser-media-utils";
import { DeviceInfo } from "../containers/StreamingSettingsCard";
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
  <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center ">
    <button
      className="btn btn-success btn-sm m-2"
      onClick={() => {
        const id = deviceId + crypto.randomUUID();
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
