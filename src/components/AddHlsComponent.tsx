import React, { FC, useState } from "react";
import { useServerSdk } from "./ServerSdkContext";

type Props = {
  roomId: string;
  refetchIfNeeded: () => void;
  isHLSSupported: boolean;
  hasHlsComponent: boolean;
};

const AddHlsComponent: FC<Props> = ({ roomId, refetchIfNeeded, isHLSSupported, hasHlsComponent }) => {
  const { roomApi } = useServerSdk();
  const [isLLHls, setIsLLHls] = useState(false);

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div className="card-body p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <h3>Low Latency HLS:</h3>
            <input type="checkbox" className="toggle" checked={isLLHls} onChange={() => setIsLLHls(!isLLHls)} />
          </div>
          <div
            className={isHLSSupported && !hasHlsComponent ? "" : "tooltip tooltip-info z-10"}
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
