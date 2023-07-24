import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import { getUserMedia } from "@jellyfish-dev/browser-media-utils";
import { CloseButton } from "./CloseButton";
import { DeviceInfo } from "../containers/StreamingSettingsPanel";
import { FaMicrophone } from "react-icons/fa";
import { AudioPlayer } from "./AudioPlayer";
type AudioTileProps = {
  deviceId: string;
  label: string;
  setActiveAudioStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;
  setSelectedAudioId: (cameraId: DeviceInfo | null) => void;
  selected: boolean;
  streamInfo: StreamInfo | null;
};
export const AudioTile = ({
  deviceId,
  label,
  setActiveAudioStreams,
  setSelectedAudioId,
  selected,
  streamInfo,
}: AudioTileProps) => (
  <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center indicator">
    {!streamInfo?.stream ? (
      <button
        className="btn btn-success btn-sm m-2"
        disabled={!!streamInfo?.stream}
        onClick={() => {
          getUserMedia(deviceId, "audio").then((stream) => {
            setActiveAudioStreams((prev) => {
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
        <FaMicrophone className="ml-2" size="20" />
      </button>
    ) : (
      <div className="flex flex-col min-w-fit  hover:cursor-pointer w-20 h-14 bg-gray-200 justify-center items-center rounded-md">
        <CloseButton
          onClick={() => {
            setActiveAudioStreams((prev) => {
              setSelectedAudioId(null);
              const mediaStreams = { ...prev };
              mediaStreams[deviceId].stream.getAudioTracks().forEach((track) => {
                track.stop();
              });
              delete mediaStreams[deviceId];
              return mediaStreams;
            });
          }}
        />
        {selected && <span className="indicator-item badge badge-success badge-lg"></span>}
        <AudioPlayer stream={streamInfo.stream} size={"20"} />
      </div>
    )}
    <div className="flex flex-col h-fit ">
      <div className="p-1">{label}</div>
    </div>
  </div>
);
