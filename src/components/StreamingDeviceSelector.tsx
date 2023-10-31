import { useState } from "react";
import { VideoDevicePanel } from "./VideoDevicePanel";
import { AudioDevicePanel } from "./AudioDevicePanel";
import { showToastError } from "./Toasts";

import { EnumerateDevices, enumerateDevices } from "../utils/browser-media-utils";
import { MockVideoPanel } from "./MockVideoPanel";
import { DeviceInfo } from "../containers/StreamingSettingsCard";
import { ScreensharingPanel } from "./ScreensharingPanel";

export type StreamInfo = {
  stream: MediaStream;
  id: string;
};
export type DeviceIdToStream = Record<string, StreamInfo>;

type StreamingDeviceSelectorProps = {
  id: string;
  selectedDeviceId: DeviceInfo | null;
  setSelectedDeviceId: (info: DeviceInfo | null) => void;
  addLocalStream: (stream: MediaStream, id: string) => void;
};

export const StreamingDeviceSelector = ({
  id,
  selectedDeviceId,
  setSelectedDeviceId,
  addLocalStream,
}: StreamingDeviceSelectorProps) => {
  const [enumerateDevicesState, setEnumerateDevicesState] = useState<EnumerateDevices | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {enumerateDevicesState?.video?.type !== "OK" && (
        <button
          className="btn btn-sm btn-info w-full"
          onClick={() => {
            enumerateDevices({}, {})
              .then((result) => {
                setEnumerateDevicesState(result);
              })
              .catch((error: unknown) => {
                if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
                  showToastError(error?.message || "Enumerate device error");
                }
                console.log("Error caught " + error);
              });
          }}
        >
          List devices
        </button>
      )}

      <div className="flex place-content-center align-baseline flex-col flex-wrap w-full gap-3">
        {enumerateDevicesState?.video.type === "OK" &&
          enumerateDevicesState.video.devices.map(({ deviceId, label }) => (
            <div key={deviceId} className="join-item w-full">
              <VideoDevicePanel
                key={deviceId}
                deviceId={deviceId}
                label={label}
                addLocalVideoStream={addLocalStream}
                setSelectedVideoId={setSelectedDeviceId}
                selected={selectedDeviceId?.id === deviceId}
              />
            </div>
          ))}

        {enumerateDevicesState?.audio?.type === "OK" &&
          enumerateDevicesState.audio.devices
            .filter(({ label }) => !label.startsWith("Default"))
            .map(({ deviceId, label }) => (
              <div key={deviceId} className="join-item w-full">
                <AudioDevicePanel
                  key={deviceId}
                  deviceId={deviceId}
                  label={label}
                  addLocalAudioStream={addLocalStream}
                  setSelectedAudioId={setSelectedDeviceId}
                  selected={selectedDeviceId?.id === deviceId}
                />
              </div>
            ))}

        <ScreensharingPanel
          addLocalStream={addLocalStream}
          setSelectedDeviceId={setSelectedDeviceId}
          label={"Screenshare"}
        />

        <MockVideoPanel
          id={id}
          addLocalVideoStream={addLocalStream}
          selectedDeviceId={selectedDeviceId}
          setSelectedDeviceId={setSelectedDeviceId}
        />
      </div>
    </div>
  );
};
