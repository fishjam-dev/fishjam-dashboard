import { AiOutlineCamera } from "react-icons/ai";
import { DeviceInfo } from "../containers/StreamingSettingsCard";
import { v4 as uuidv4 } from "uuid";
import { atom, useAtom } from "jotai";
import { TrackSource } from "../containers/Client";
import { showToastInfo } from "./Toasts";

type VideoDevicePanelProps = {
  deviceId: string;
  label: string;
  addLocalVideoStream: (stream: MediaStream, id: string, source: TrackSource, stop: () => void) => void;
  setSelectedVideoId: (cameraId: DeviceInfo | null) => void;
  selected: boolean;
  constraints?: MediaTrackConstraints;
};

export const activeLocalCamerasAtom = atom(0);

export const VideoDevicePanel = ({
  deviceId,
  label,
  addLocalVideoStream,
  setSelectedVideoId,
  constraints,
}: VideoDevicePanelProps) => {
  const [activeLocalCameras, setActiveLocalCameras] = useAtom(activeLocalCamerasAtom);
  return (
    <div className="flex w-full flex-row flex-1 items-center gap-2">
      <button
        className="btn btn-success btn-sm"
        onClick={async () => {
          const id = deviceId + uuidv4();
          const con = constraints ? constraints : {};

          if (activeLocalCameras > 0) {
            showToastInfo(`An active camera imposes constraints on a newly created stream`);
          }

          setActiveLocalCameras((prev) => prev + 1);

          await navigator.mediaDevices
            .getUserMedia({
              video: {
                ...con,
                deviceId: {
                  exact: deviceId,
                },
              },
            })
            .then((stream) => {
              setSelectedVideoId({ id: id, type: "video", stream });
              addLocalVideoStream(stream, id, "navigator", () => {});
            })
            .catch(() => {
              setActiveLocalCameras((prev) => prev - 1);
            });
        }}
      >
        Start
        <AiOutlineCamera className="ml-2" size="25" />
      </button>
      <div className="p-1">{label}</div>
    </div>
  );
};
