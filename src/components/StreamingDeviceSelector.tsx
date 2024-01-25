import React, { useState } from "react";
import { VideoDevicePanel } from "./VideoDevicePanel";
import { AudioDevicePanel } from "./AudioDevicePanel";
import { showToastError } from "./Toasts";

import { EnumerateDevices, enumerateDevices } from "../utils/browser-media-utils";
import { MockVideoPanel } from "./MockVideoPanel";
import { DeviceInfo } from "../containers/StreamingSettingsCard";
import { ScreensharingPanel } from "./ScreensharingPanel";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { TbArrowBack } from "react-icons/tb";
import { TrackSource } from "../containers/Client";

export type StreamInfo = {
  stream: MediaStream;
  id: string;
};

type StreamingDeviceSelectorProps = {
  id: string;
  selectedDeviceId: DeviceInfo | null;
  setSelectedDeviceId: (info: DeviceInfo | null) => void;
  addLocalStream: (stream: MediaStream, id: string, source: TrackSource) => void;
};

const widthAtom = atomWithStorage("width-constraint", 1280);
const heightAtom = atomWithStorage("height-constraint", 720);
const frameRateAtom = atomWithStorage("frame-rate-constraint", 24);
const forceConstraintsAtom = atomWithStorage("force-constraint", true);

export const StreamingDeviceSelector = ({
  id,
  selectedDeviceId,
  setSelectedDeviceId,
  addLocalStream,
}: StreamingDeviceSelectorProps) => {
  const [enumerateDevicesState, setEnumerateDevicesState] = useState<EnumerateDevices | null>(null);

  const [width, setWidth] = useAtom(widthAtom);
  const [height, setHeight] = useAtom(heightAtom);
  const [frameRate, setFrameRate] = useAtom(frameRateAtom);
  const [forceConstraints, setForceConstraints] = useAtom(forceConstraintsAtom);

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
                console.error("Error caught " + error);
              });
          }}
        >
          List devices
        </button>
      )}

      <div className="flex place-content-center align-baseline flex-col flex-wrap w-full gap-3">
        {enumerateDevicesState?.video.type === "OK" && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <div className="flex flex-row flex-nowrap justify-between">
                <div className="flex flex-row items-center gap-2">
                  <label htmlFor="force-video-constraints">Force video constraints</label>
                  <input
                    className="checkbox"
                    type="checkbox"
                    name="force-video-constraints"
                    checked={forceConstraints}
                    onChange={() => setForceConstraints((prev) => !prev)}
                  />
                </div>

                <button
                  className="btn btn-neutral btn-sm p-1 ml-1 tooltip tooltip-info tooltip-right"
                  data-tip="Restore default"
                  onClick={() => {
                    setWidth(1280);
                    setHeight(720);
                    setFrameRate(24);
                  }}
                >
                  <TbArrowBack size={"1.5em"} />
                </button>
              </div>
              <div className="flex flex-row flex-nowrap items-center">
                <label className="label flex-row gap-2">
                  <span className="label-text">width</span>
                  <input
                    disabled={!forceConstraints}
                    type="number"
                    value={width}
                    className="input w-full input-sm max-w-xs"
                    onChange={(e) => {
                      const parsed = Number.parseInt(e.target.value);
                      if (isNaN(parsed)) return;
                      setWidth(() => parsed);
                    }}
                  />
                </label>
                <label className="label flex-row gap-2">
                  <span className="label-text">height</span>
                  <input
                    disabled={!forceConstraints}
                    type="number"
                    value={height}
                    className="input w-full input-sm max-w-xs"
                    onChange={(e) => {
                      const parsed = Number.parseInt(e.target.value);
                      if (isNaN(parsed)) return;
                      setHeight(parsed);
                    }}
                  />
                </label>
                <label className="label flex-row gap-2">
                  <span className="label-text">frame rate</span>
                  <input
                    disabled={!forceConstraints}
                    type="number"
                    value={frameRate}
                    className="input w-full input-sm max-w-xs"
                    onChange={(e) => {
                      const parsed = Number.parseInt(e.target.value);
                      if (isNaN(parsed)) return;
                      setFrameRate(parsed);
                    }}
                  />
                </label>
              </div>
            </div>
            {enumerateDevicesState.video.devices.map(({ deviceId, label }) => (
              <div key={deviceId} className="join-item w-full">
                <VideoDevicePanel
                  key={deviceId}
                  deviceId={deviceId}
                  constraints={forceConstraints ? { width, height, frameRate } : undefined}
                  label={label}
                  addLocalVideoStream={addLocalStream}
                  setSelectedVideoId={setSelectedDeviceId}
                  selected={selectedDeviceId?.id === deviceId}
                />
              </div>
            ))}
          </div>
        )}
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
