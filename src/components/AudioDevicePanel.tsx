import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import { DeviceInfo } from "../containers/StreamingSettingsPanel";
import { FaMicrophone } from "react-icons/fa";
import { getUserMedia } from "../utils/browser-media-utils";

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
export const AudioDevicePanel = ({
  deviceId,
  activeStreams,
  label,
  setActiveAudioStreams,
  setSelectedAudioId,
  selected,
  streamInfo,
}: AudioTileProps) => (
  <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center indicator">
    <button
      className="btn btn-success btn-sm m-2"
      onClick={() => {
        const id = deviceId + crypto.randomUUID();
        setSelectedAudioId({ id: id, type: "audio" });
        getUserMedia(id, "audio").then((stream) => {
          setActiveAudioStreams((prev) => {
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
      <FaMicrophone className="ml-2" size="20" />
    </button>
    {/* ) : (
      <button
        className="btn btn-error btn-sm m-2"
        disabled={!activeStreams?.[deviceId]?.stream}
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
      >
        Stop
        <FaMicrophone className="ml-2" size="25" />
      </button>
    )} */}
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
