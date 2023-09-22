import { LocalTrack } from "../containers/Client";
import { useStore } from "../containers/RoomsContext";
import { AudioPlayer } from "./AudioPlayer";
import { CloseButton } from "./CloseButton";
import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import VideoPlayer from "./VideoPlayer";

type Props = {
  streamInfo: StreamInfo;
  id: string;
  playing: LocalTrack[];
  addAudioTrack: (track: MediaStream) => void;
  setActiveStreams: (setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null) => void;
  addVideoTrack: (track: MediaStream) => void;
  activeStreams: DeviceIdToStream | null;
};

export const DeviceTile = ({
  streamInfo,
  id,
  addAudioTrack,
  addVideoTrack,
  setActiveStreams,
  activeStreams,
  playing,
}: Props) => {
  const { state, dispatch } = useStore();
  const isVideo = streamInfo.stream.getVideoTracks().length > 0;
  const api = state.rooms[state.selectedRoom || ""].peers[id].client.useSelector((state) => state.connectivity.api);
  return (
    <div className="flex flex-col w-20 justify-center rounded-md indicator">
      {isVideo ? (
        <div className=" overflow-hidden h-12">
          <VideoPlayer stream={streamInfo.stream} size={"20"} />
        </div>
      ) : (
        <div className="bg-gray-200 w-20 items-center flex flex-col rounded-md">
          <AudioPlayer stream={streamInfo.stream} size={"40"} muted={true} />
        </div>
      )}
      {playing.length === 0 ? (
        <button
          className="btn btn-success btn-sm m-2"
          onClick={() => {
            console.log("adding stream", streamInfo);
            console.log(activeStreams);
            if (isVideo) {
              addVideoTrack(streamInfo.stream);
            } else {
              addAudioTrack(streamInfo.stream);
            }
          }}
        >
          Stream
        </button>
      ) : (
        <button
          className="btn btn-error btn-sm m-2"
          onClick={() => {
            setActiveStreams((prev) => {
              const mediaStreams = { ...prev };
              mediaStreams[streamInfo.id].stream.getTracks().forEach((track) => {
                track.stop();
              });
              delete mediaStreams[streamInfo.id];
              return mediaStreams;
            });
          }}
        >
          Stop
        </button>
      )}
      <CloseButton
        onClick={() =>
          setActiveStreams((prev) => {
            playing.forEach((track) => {
              api?.removeTrack(track.id);
              dispatch({ type: "REMOVE_TRACK", roomId: state.selectedRoom || "", trackId: track.id, peerId: id });
            });
            const mediaStreams = { ...prev };
            mediaStreams[streamInfo.id].stream.getTracks().forEach((track) => {
              track.stop();
            });
            delete mediaStreams[streamInfo.id];
            return mediaStreams;
          })
        }
      />
    </div>
  );
};
