import React, { FC } from "react";
import { useServerSdk } from "./ServerSdkContext";

type Props = {
  roomId: string;
  refetchIfNeeded: () => void;
};

const AddHlsComponent: FC<Props> = ({ roomId, refetchIfNeeded }) => {
  const { componentApi } = useServerSdk();

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div className="card-body p-4">
        <button
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
