import VideoPlayer from "./VideoPlayer";
import React from "react";
import { StreamInfo } from "./VideoDeviceSelector";

type Props = {
  label: string;
  setSelectedVideoStream: (cameraId: StreamInfo | null) => void;
  selected: boolean;
  streamInfo: StreamInfo;
};

export const CanvasTile = ({ label, setSelectedVideoStream, selected, streamInfo }: Props) => (
  <div className="flex flex-col card bg-base-100 shadow-xl m-2">
    <div className="card-body p-4">
      <div className="flex flex-col w-20 indicator">
        {selected && <span className="indicator-item badge badge-success badge-lg"></span>}
        <VideoPlayer stream={streamInfo.stream} />
        <button
          type="button"
          className="btn btn-success btn-sm m-2"
          onClick={() => {
            setSelectedVideoStream(streamInfo);
          }}
        >
          Select
        </button>
      </div>
    </div>
  </div>
);
