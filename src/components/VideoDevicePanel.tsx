import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import { DeviceInfo } from "../containers/StreamingSettingsPanel";
import { AiOutlineCamera } from "react-icons/ai";
import { getUserMedia } from "../utils/browser-media-utils";
type VideoTileProps = {
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
  activeStreams,
  deviceId,
  label,
  selected,
  setActiveVideoStreams,
  setSelectedVideoId,
  streamInfo,
}: VideoTileProps) => (
  <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center indicator">
    <button
      className="btn btn-success btn-sm m-2"
      onClick={() => {
        const id = deviceId + crypto.randomUUID();
        setSelectedVideoId({ id: id, type: "video" });
        getUserMedia(deviceId, "video").then((stream) => {
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
    {/* ) : (
      <button
        className="btn btn-error btn-sm m-2"
        disabled={!activeStreams?.[deviceId]?.stream}
        onClick={() => {
          setActiveVideoStreams((prev) => {
            if (selected) setSelectedVideoId(null);
            const mediaStreams = { ...prev };
            mediaStreams[deviceId].stream.getVideoTracks().forEach((track) => {
              track.stop();
            });
            delete mediaStreams[deviceId];
            return mediaStreams;
          });
        }}
      >
        Stop
        <AiOutlineCamera className="ml-2" size="25" />
      </button>
    )} */}
    <button
      className="flex flex-1 flex-col h-full w-full"
      disabled={!activeStreams?.[deviceId]?.stream}
      onClick={() => {
        setSelectedVideoId({ id: deviceId, type: "video" });
      }}
    >
      <div className="p-1">{label}</div>
    </button>
  </div>
);
