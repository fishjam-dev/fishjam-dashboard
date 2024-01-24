import React, { FC } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Props = {
  roomId: string;
  refetchIfNeeded: () => void;
  hasFileComponent: boolean;
};

const urlAtom = atomWithStorage("file-path", "");

const AddFileComponent: FC<Props> = ({ roomId, refetchIfNeeded, hasFileComponent }) => {
  const { roomApi } = useServerSdk();
  const [filePath, setFilePath] = useAtom(urlAtom);

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div className="card-body p-4">
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-col flex-grow">
            <input
              value={filePath}
              onChange={(e) => setFilePath(e.target.value.trim())}
              className="input input-bordered w-full"
              placeholder="File Path"
            />
          </div>
          <div
            className={(!hasFileComponent ? "" : "tooltip tooltip-info z-10") + " flex flex-nowrap"}
            data-tip={hasFileComponent ? "File component already exists in this room" : ""}
          >
            <button
              disabled={hasFileComponent}
              onClick={() => {
                roomApi
                  ?.addComponent(roomId, {
                    type: "file",
                    options: {
                      filePath: filePath,
                    },
                  })
                  .then(() => {
                    refetchIfNeeded();
                  });
              }}
              className="btn btn-success"
            >
              Add File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFileComponent;
