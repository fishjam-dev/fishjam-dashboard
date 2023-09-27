import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import { AiOutlineCamera } from "react-icons/ai";
import { getUserMedia } from "../utils/browser-media-utils";
import { DeviceInfo } from "../containers/StreamingSettingsCard";
type VideoDevicePanelProps = {
  deviceId: string;
  activeStreams: DeviceIdToStream | null;
  label: string;
  setActiveVideoStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;

  setSelectedVideoId: (cameraId: DeviceInfo | null) => void;
  selected: boolean;
  streamInfo: StreamInfo | null;
};
export const VideoDevicePanel = ({
  deviceId,
  label,
  setActiveVideoStreams,
  setSelectedVideoId,
}: VideoDevicePanelProps) => (
  <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center ">
    <button
      className="btn btn-success btn-sm m-2"
      onClick={() => {
        const id = deviceId + crypto.randomUUID();
        getUserMedia(deviceId, "video").then((stream) => {
          setSelectedVideoId({ id: id, type: "video", stream: stream });
          setActiveVideoStreams((prev) => {
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
      <AiOutlineCamera className="ml-2" size="25" />
    </button>
    <div className="p-1">{label}</div>
  </div>
);
