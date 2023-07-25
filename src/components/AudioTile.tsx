import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import { getUserMedia } from "@jellyfish-dev/browser-media-utils";
import { CloseButton } from "./CloseButton";
import { DeviceInfo } from "../containers/StreamingSettingsPanel";
import { FaMicrophone } from "react-icons/fa";
import { AudioPlayer } from "./AudioPlayer";
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
export const AudioTile = ({
  deviceId,
  activeStreams,
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
      <div className="flex flex-col min-w-fit w-20 h-14 bg-gray-200 justify-center items-center rounded-md">
        <CloseButton
          onClick={() => {
            setActiveAudioStreams((prev) => {
              if (selected) setSelectedAudioId(null);
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
        <button
          className="flex flex-1 flex-col min-w-fit w-20 h-14 bg-gray-200 justify-center items-center rounded-md"
          disabled={!activeStreams?.[deviceId]?.stream}
          onClick={() => {
            setSelectedAudioId({ id: deviceId, type: "audio" });
          }}
        >
          <AudioPlayer stream={streamInfo.stream} size={"20"} />
        </button>
      </div>
    )}
    <button
      className="flex flex-1 flex-col h-full w-full"
      disabled={!activeStreams?.[deviceId]?.stream}
      onClick={() => {
        setSelectedAudioId({ id: deviceId, type: "audio" });
      }}
    >
      <div className="p-1">{label}</div>
    </button>
  </div>
);
