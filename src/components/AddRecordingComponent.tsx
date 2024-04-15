import React, { FC, useState } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

type Props = {
  roomId: string;
  refetchIfNeeded: () => void;
};

const isLLHlsAtom = atomWithStorage("hls-endpoint-is-LLHls", true);
const persistentAtom = atomWithStorage("hls-endpoint-persistent", false);
const subscribeModeAtom = atomWithStorage<"auto" | "manual">("hls-endpoint-subscribe-mode", "auto");
const targetWindowDurationAtom = atomWithStorage<null | number>("hls-endpoint-target-window-duration", null);

const AddRecordingComponent: FC<Props> = ({ roomId, refetchIfNeeded }) => {
  const { roomApi } = useServerSdk();
  const [useCustomCredentials, setUseCustomCredentials] = useState(false);
  const [bucket, setBucket] = useState("");
  const [region, setRegion] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const filledCustomCredentials = bucket && region && accessKeyId && secretAccessKey;

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <label className="flex align-center gap-2">
            Use custom S3 credentials
            <input
              type="checkbox"
              className="checkbox"
              checked={useCustomCredentials}
              onChange={(e) => setUseCustomCredentials(e.target.checked)}
            />
          </label>
          <button
            disabled={!filledCustomCredentials}
            onClick={() => {
              // roomApi
              //   ?.addComponent(roomId, {
              //     type: "recording",
              //     options: {
              //       filePath: filePath,
              //       framerate: framerate ?? undefined,
              //     },
              //   })
              //   .then(() => {
              //     refetchIfNeeded();
              //   });
            }}
            className="btn btn-success"
          >
            Add File
          </button>
        </div>
        {useCustomCredentials && (
          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-2 flex items-center gap-1">
              <span>Bucket</span>
              <input
                value={bucket}
                onChange={(e) => setBucket(e.target.value.trim())}
                className="input input-bordered flex-grow"
                placeholder="bucket-name"
              />
            </label>

            <label className="flex items-center gap-1">
              <span>Region</span>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value.trim())}
                className="input input-bordered w-32"
                placeholder="eu-central-1"
              />
            </label>
            <label className="flex items-center gap-1 col-span-full">
              <span>Access key ID</span>
              <input
                value={accessKeyId}
                onChange={(e) => setAccessKeyId(e.target.value.trim())}
                className="input input-bordered w-64"
                placeholder="AKIAIOSFODNN7EXAMPLE"
              />
            </label>
            <label className="flex items-center gap-1 col-start-1 col-span-2">
              <span>Secret access key</span>
              <input
                value={secretAccessKey}
                onChange={(e) => setSecretAccessKey(e.target.value.trim())}
                className="input input-bordered flex-1"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRecordingComponent;
