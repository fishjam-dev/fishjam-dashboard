import { DeviceInfo } from "../containers/StreamingSettingsCard";
import { useState } from "react";
import { showToastError } from "./Toasts";
import { TbScreenShare } from "react-icons/tb";

type ScreensharingPanelProps = {
  addLocalStream: (stream: MediaStream, id: string) => void;
  label: string;
  setSelectedDeviceId: (trackId: DeviceInfo | null) => void;
};

const SCREEENSHARING_VIDEO_CONSTRAINTS = {
  frameRate: { ideal: 20, max: 25 },
  width: { max: 1920, ideal: 1920 },
  height: { max: 1080, ideal: 1080 },
};

export const ScreensharingPanel = ({ label, addLocalStream, setSelectedDeviceId }: ScreensharingPanelProps) => {
  const [screenshareAudio, setScreenshareAudio] = useState<boolean>(false);
  return (
    <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center ">
      <button
        className="btn btn-success btn-sm m-2"
        onClick={() => {
          const videoId = "screenshare_" + crypto.randomUUID();
          const audioId = "screenshare_" + crypto.randomUUID();
          if (navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices
              .getDisplayMedia({
                video: SCREEENSHARING_VIDEO_CONSTRAINTS,
                audio: screenshareAudio,
              })
              .then((stream) => {
                const videoStream = new MediaStream(stream.getVideoTracks());
                const audioStream = new MediaStream(stream.getAudioTracks());
                setSelectedDeviceId({ id: videoId, type: "screenshare", stream: videoStream });
                addLocalStream(videoStream, videoId);
                if (screenshareAudio) {
                  addLocalStream(audioStream, audioId);
                }
              });
          } else {
            showToastError("Screensharing is not supported in this browser");
          }
        }}
      >
        Start
        <TbScreenShare className="ml-2" size="25" />
      </button>
      <span className="text ml-2">Screenshare audio:</span>
      <input
        type="checkbox"
        className="checkbox"
        checked={screenshareAudio}
        onChange={() => {
          setScreenshareAudio(!screenshareAudio);
        }}
      />
      <div className="p-1">{label}</div>
    </div>
  );
};
