import VideoPlayer from "./VideoPlayer";
import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import { CloseButton } from "./CloseButton";
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
export const VideoTile = ({
  activeStreams,
  deviceId,
  label,
  setActiveVideoStreams,
  setSelectedVideoId,
  selected,
  streamInfo,
}: VideoTileProps) => (
  <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center indicator">
    {!streamInfo?.stream ? (
      <button
        className="btn btn-success btn-sm m-2"
        disabled={!!streamInfo?.stream}
        onClick={() => {
          getUserMedia(deviceId, "video").then((stream) => {
            setActiveVideoStreams((prev) => {
              return {
                ...prev,
                [deviceId]: {
                  stream,
                  id: deviceId,
                },
              };
            });
          });
        }}
      >
        Start
        <AiOutlineCamera className="ml-2" size="25" />
      </button>
    ) : (
      <div className="flex flex-col w-fit">
        <CloseButton
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
        />
        {selected && <span className="indicator-item badge badge-success badge-lg"></span>}
        <button
          className="flex flex-1 flex-col w-full h-full"
          disabled={!activeStreams?.[deviceId]?.stream}
          onClick={() => {
            setSelectedVideoId({ id: deviceId, type: "video" });
          }}
        >
          <VideoPlayer stream={streamInfo.stream} size={"20"} />
        </button>
      </div>
    )}
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
