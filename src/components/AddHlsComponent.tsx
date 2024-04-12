import React, { FC } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

type Props = {
  roomId: string;
  refetchIfNeeded: () => void;
  isHLSSupported: boolean;
  hasHlsComponent: boolean;
};

const isLLHlsAtom = atomWithStorage("hls-endpoint-is-LLHls", true);
const persistentAtom = atomWithStorage("hls-endpoint-persistent", false);
const subscribeModeAtom = atomWithStorage<"auto" | "manual">("hls-endpoint-subscribe-mode", "auto");
const targetWindowDurationAtom = atomWithStorage<null | number>("hls-endpoint-target-window-duration", null);

const AddHlsComponent: FC<Props> = ({ roomId, refetchIfNeeded, isHLSSupported, hasHlsComponent }) => {
  const { roomApi } = useServerSdk();
  const [isLLHls, setIsLLHls] = useAtom(isLLHlsAtom);
  const [persistent, setPersistent] = useAtom(persistentAtom);
  const [subscribeMode, setSubscribeMode] = useAtom(subscribeModeAtom);
  const [targetWindowDuration, setTargetWindowDuration] = useAtom(targetWindowDurationAtom);

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div className="card-body p-4">
        <div className="flex w-full gap-2">
          <input
            value={targetWindowDuration ?? ""}
            onChange={(e) => {
              if (e.target.value === "") {
                setTargetWindowDuration(null);
                return;
              }

              const parsed = parseInt(e.target.value);
              if (isNaN(parsed)) return;
              if (parsed < 0) return;
              setTargetWindowDuration(parsed);
            }}
            className="input input-bordered flex-1"
            placeholder="Target window duration"
          />

          <div className="flex flex-col justify-center tooltip" data-tip="Persistent">
            <input
              className="checkbox"
              type="checkbox"
              checked={persistent}
              onChange={() => setPersistent((prev) => !prev)}
            />
          </div>

          <div className="flex flex-col justify-center tooltip" data-tip="Low Latency HLS:">
            <input
              className="checkbox"
              type="checkbox"
              checked={isLLHls}
              onChange={() => setIsLLHls((prev) => !prev)}
            />
          </div>

          <label
            data-tip="Subscribe mode"
            className="flex flex-row justify-start gap-1 label cursor-pointer form-control tooltip tooltip-info tooltip-top"
          >
            <span className="label-text">manual</span>
            <input
              type="checkbox"
              className="toggle"
              checked={subscribeMode === "auto"}
              onChange={() => setSubscribeMode((prev) => (prev === "manual" ? "auto" : "manual"))}
            />
            <span className="label-text">auto</span>
          </label>

          <div
            className={isHLSSupported && !hasHlsComponent ? "" : "tooltip tooltip-info"}
            data-tip={
              isHLSSupported
                ? hasHlsComponent
                  ? "HLS component already exists in this room"
                  : ""
                : "Codec does not support HLS streaming"
            }
          >
            <button
              disabled={!isHLSSupported || hasHlsComponent}
              onClick={() => {
                roomApi
                  ?.addComponent(roomId, {
                    type: "hls",
                    options: {
                      lowLatency: isLLHls,
                      persistent: persistent,
                      subscribeMode: subscribeMode,
                      targetWindowDuration: targetWindowDuration,
                    },
                  })
                  .then(() => {
                    refetchIfNeeded();
                  });
              }}
              className="btn btn-success"
            >
              Add HLS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHlsComponent;
