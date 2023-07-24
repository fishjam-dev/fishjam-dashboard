import VideoPlayer from "./VideoPlayer";
import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import { getUserMedia } from "@jellyfish-dev/browser-media-utils";
import { CloseButton } from "./CloseButton";
import { DeviceInfo } from "../containers/StreamingSettingsPanel";
import { AiOutlineCamera } from "react-icons/ai";
type VideoTileProps = {
  deviceId: string;
  label: string;
  setActiveVideoStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;
  setSelectedVideoId: (cameraId: DeviceInfo | null) => void;
  selected: boolean;
  streamInfo: StreamInfo | null;
};
export const VideoTile = ({
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
      <div className="flex flex-col w-fit  hover:cursor-pointer">
        <CloseButton
          onClick={() => {
            setActiveVideoStreams((prev) => {
              setSelectedVideoId(null);
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
        <VideoPlayer stream={streamInfo.stream} size={"20"} />
      </div>
    )}
    <div className="flex flex-col h-fit ">
      <div className="p-1">{label}</div>
    </div>
  </div>
);
