import { AudioPlayer } from "./AudioPlayer";
import { StreamInfo } from "./StreamingDeviceSelector";
import VideoPlayer from "./VideoPlayer";

type Props = {
  selected: boolean;
  streamInfo: StreamInfo;
};

export const DeviceTile = ({ selected, streamInfo }: Props) => (
  <div className="flex flex-col w-20 indicator rounded-md items-center bg-gray-200">
    {selected && <span className="indicator-item badge badge-success badge-lg"></span>}
    {streamInfo.stream.getVideoTracks().length > 0 ? (
      <div className=" overflow-hidden h-12">
        <VideoPlayer stream={streamInfo.stream} size={"20"} />
      </div>
    ) : (
      <AudioPlayer stream={streamInfo.stream} size={"41"} muted={true} />
    )}
  </div>
);
