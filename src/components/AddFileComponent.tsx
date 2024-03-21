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
const framerateAtom = atomWithStorage<null | number>("file-framerate", null);

const AddFileComponent: FC<Props> = ({ roomId, refetchIfNeeded, hasFileComponent }) => {
  const { roomApi } = useServerSdk();
  const [filePath, setFilePath] = useAtom(urlAtom);
  const [framerate, setFramerate] = useAtom(framerateAtom);

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div className="card-body p-4">
        <div className="flex">
          <input
            value={filePath}
            onChange={(e) => setFilePath(e.target.value.trim())}
            className="input input-bordered flex-grow"
            placeholder="File Path"
          />
          <label className="ml-2 flex items-center gap-1 mr-1 min-w-0">
            <span>Framerate</span>
            <input
              type="number"
              value={framerate ?? ""}
              min={1}
              onChange={(e) => setFramerate(parseInt(e.target.value) || null)}
              className="input input-bordered flex-1 min-w-0"
              placeholder="30"
            />
          </label>
          <div
            className={!hasFileComponent ? "" : "tooltip tooltip-info z-10"}
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
                      framerate: framerate ?? undefined,
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
