import { AudioPlayer } from "./AudioPlayer";
import { CloseButton } from "./CloseButton";
import { DeviceIdToStream, StreamInfo } from "./StreamingDeviceSelector";
import VideoPlayer from "./VideoPlayer";

type Props = {
  streamInfo: StreamInfo;
  addAudioTrack: (track: MediaStream) => void;
  setActiveStreams: (setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null) => void;
  addVideoTrack: (track: MediaStream) => void;
};

export const DeviceTile = ({ streamInfo, addAudioTrack, addVideoTrack, setActiveStreams }: Props) => {
  const isVideo = streamInfo.stream.getVideoTracks().length > 0;
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
      <button
        className="btn btn-success btn-sm m-2"
        onClick={() => {
          if (isVideo) {
            addVideoTrack(streamInfo.stream);
          } else {
            addAudioTrack(streamInfo.stream);
          }
        }}
      >
        Stream
      </button>
      <CloseButton
        onClick={() =>
          setActiveStreams((prev) => {
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
