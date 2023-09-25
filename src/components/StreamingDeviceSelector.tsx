import { useState } from "react";
import { VideoDevicePanel } from "./VideoDevicePanel";
import { AudioDevicePanel } from "./AudioDevicePanel";
import { EnumerateDevices, enumerateDevices } from "../utils/browser-media-utils";
import { MockVideoPanel } from "./MockVideoPanel";
import { DeviceInfo } from "../containers/StreamingCard";

export type StreamInfo = {
  stream: MediaStream;
  id: string;
};
export type DeviceIdToStream = Record<string, StreamInfo>;

type Props = {
  id: string;
  selectedDeviceId: DeviceInfo | null;
  setSelectedDeviceId: (info: DeviceInfo | null) => void;
  activeStreams: DeviceIdToStream | null;
  setActiveStreams: (setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null) => void;
};

export const StreamingDeviceSelector = ({
  id,
  selectedDeviceId,
  setSelectedDeviceId,
  activeStreams,
  setActiveStreams,
}: Props) => {
  const [enumerateDevicesState, setEnumerateDevicesState] = useState<EnumerateDevices | null>(null);

  return (
    <div>
      {enumerateDevicesState?.video.type !== "OK" && (
        <button
          className="btn btn-sm btn-info y-2 w-full"
          onClick={() => {
            enumerateDevices({}, {})
              .then((result) => {
                setEnumerateDevicesState(result);
              })
              .catch((error) => {
                console.log("Error caught " + error);
                setEnumerateDevicesState(error);
              });
            console.log(activeStreams);
          }}
        >
          List devices
        </button>
      )}

      <div className="flex place-content-center align-baseline flex-col  flex-wrap w-full">
        {enumerateDevicesState?.video.type === "OK" &&
          enumerateDevicesState.video.devices.map(({ deviceId, label }) => (
            <div key={deviceId} className="join-item w-full">
              <VideoDevicePanel
                activeStreams={activeStreams}
                key={deviceId}
                deviceId={deviceId}
                label={label}
                setActiveVideoStreams={setActiveStreams}
                setSelectedVideoId={setSelectedDeviceId}
                selected={selectedDeviceId?.id === deviceId}
                streamInfo={(activeStreams && activeStreams[deviceId]) || null}
              />
            </div>
          ))}

        {enumerateDevicesState?.audio.type === "OK" &&
          enumerateDevicesState.audio.devices
            .filter(({ label }) => !label.startsWith("Default"))
            .map(({ deviceId, label }) => (
              <div key={deviceId} className="join-item w-full">
                <AudioDevicePanel
                  activeStreams={activeStreams}
                  key={deviceId}
                  deviceId={deviceId}
                  label={label}
                  setActiveAudioStreams={setActiveStreams}
                  setSelectedAudioId={setSelectedDeviceId}
                  selected={selectedDeviceId?.id === deviceId}
                  streamInfo={(activeStreams && activeStreams[deviceId]) || null}
                />
              </div>
            ))}

        <MockVideoPanel
          id={id}
          activeStreams={activeStreams}
          setActiveVideoStreams={setActiveStreams}
          selectedDeviceId={selectedDeviceId}
          setSelectedDeviceId={setSelectedDeviceId}
        />
      </div>
    </div>
  );
};
