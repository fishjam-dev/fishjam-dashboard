import VideoPlayer from "./VideoPlayer";
import { StreamInfo } from "./StreamingDeviceSelector";
import { DeviceInfo } from "../containers/StreamingSettingsPanel";

type Props = {
  label: string;
  selected: boolean;
  streamInfo: StreamInfo;
};

export const CanvasTile = ({ label, selected, streamInfo }: Props) => (
  <div className="card-body  rounded-md p-4">
    <div className="flex flex-col w-20   indicator">
      {selected && <span className="indicator-item badge badge-success badge-lg"></span>}
      <VideoPlayer stream={streamInfo.stream} />
    </div>
  </div>
);
