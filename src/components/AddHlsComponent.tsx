import React, { FC } from "react";
import { useServerSdk } from "./ServerSdkContext";

type Props = {
  roomId: string;
  refetchIfNeeded: () => void;
  isHLSSupported: boolean;
  hasHlsComponent: boolean;
};

const AddHlsComponent: FC<Props> = ({ roomId, refetchIfNeeded, isHLSSupported, hasHlsComponent }) => {
  const { componentApi } = useServerSdk();

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div
        className={isHLSSupported && !hasHlsComponent ? "card-body p-4" : "card-body p-4 tooltip tooltip-info z-10"}
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
            componentApi
              ?.jellyfishWebComponentControllerCreate(roomId, {
                type: "hls",
                options: {},
              })
              .then(() => {
                refetchIfNeeded();
              });
          }}
          className="btn btn-success w-full"
        >
          Add HLS
        </button>
      </div>
    </div>
  );
};

export default AddHlsComponent;
