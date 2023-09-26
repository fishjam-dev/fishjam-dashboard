import { LocalTrack } from "../containers/Client";
import { useStore } from "../containers/RoomsContext";
import { DeviceInfo } from "../containers/StreamingCard";
import AudioVisualizer from "./AudioVisualizer";
import { CloseButton } from "./CloseButton";
import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import VideoPlayer from "./VideoPlayer";

type Props = {
  selectedId: DeviceInfo | null;
  setSelectedId: (device: DeviceInfo | null) => void;
  streamInfo: StreamInfo;
  id: string;
  playing: LocalTrack[];
  addAudioTrack: (track: MediaStream) => void;
  setActiveStreams: (setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null) => void;
  addVideoTrack: (track: MediaStream) => void;
  activeStreams: DeviceIdToStream | null;
};

const getDeviceType = (stream: MediaStream) => {
  if (stream.getVideoTracks().length > 0) {
    return "video";
  } else {
    return "audio";
  }
};

export const DeviceTile = ({ selectedId, setSelectedId, streamInfo, id, setActiveStreams, playing }: Props) => {
  const isDisabled = streamInfo.stream.getTracks().some((track) => !track.enabled);
  const { state, dispatch } = useStore();
  const isVideo = streamInfo.stream.getVideoTracks().length > 0;
  const api = state.rooms[state.selectedRoom || ""].peers[id].client.useSelector((state) => state.connectivity.api);
  return (
    <div
      className={`flex flex-col w-40 justify-center rounded-md indicator ${
        selectedId?.id === streamInfo.id ? " border-2 border-green-500 " : ""
      }`}
    >
      <button
        className={`h-fit w-fit `}
        onClick={() => {
          setSelectedId({ id: streamInfo.id, type: getDeviceType(streamInfo.stream), stream: streamInfo.stream });
        }}
      >
        {isVideo ? (
          <div className=" overflow-hidden h-24">
            <VideoPlayer stream={streamInfo.stream} size={"40"} />
          </div>
        ) : (
          <div className="w-fit items-center flex flex-col rounded-md">
            <AudioVisualizer stream={streamInfo.stream} muted={true} size={37} width={90} />
          </div>
        )}
      </button>
      <button
        className={`btn ${isDisabled ? "btn-success" : "btn-error "} btn-sm m-2`}
        onClick={() => {
          console.log("isDisabled", isDisabled);
          streamInfo.stream.getTracks().forEach((track) => {
            track.enabled = isDisabled;
          });
        }}
      >
        {isDisabled ? "Enable" : "Disable"}
      </button>
      <CloseButton
        onClick={() => {
          playing.forEach((track) => {
            api?.removeTrack(track.id);
            dispatch({ type: "REMOVE_TRACK", roomId: state.selectedRoom || "", trackId: track.id, peerId: id });
          });
          setActiveStreams((prev) => {
            const mediaStreams = { ...prev };
            mediaStreams[streamInfo.id].stream.getTracks().forEach((track) => {
              track.stop();
            });
            delete mediaStreams[streamInfo.id];
            return mediaStreams;
          });
        }}
      />
    </div>
  );
};
