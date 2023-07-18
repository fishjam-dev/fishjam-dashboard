import VideoPlayer from "./VideoPlayer";
import React from "react";
import { StreamInfo } from "./VideoDeviceSelector";

type Props = {
  label: string;
  setSelectedVideoId: (cameraId: string | null) => void;
  selected: boolean;
  streamInfo: StreamInfo;
};

export const CanvasTile = ({ label, setSelectedVideoId, selected, streamInfo }: Props) => (
  <div className="flex flex-col card bg-base-100 shadow-xl m-2">
    <div className="card-body p-4">
      <div className="flex flex-col w-20   indicator">
      {selected && <span className="indicator-item badge badge-success badge-lg"></span>}
          <VideoPlayer stream={streamInfo.stream} />
      </div>
    </div>
  </div>
);
