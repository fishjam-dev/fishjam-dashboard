import React, { FC, useState } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { showToastError } from "./Toasts";

type Props = {
  roomId: string;
  refetchIfNeeded: () => void;
};

const subscribeModeAtom = atomWithStorage<"auto" | "manual">("recording-component-subscribe-mode", "auto");
const pathPrefixAtom = atomWithStorage<string>("recording-component-path-prefix", "");
const bucketAtom = atomWithStorage<string>("recording-component-s3-bucket", "");
const regionAtom = atomWithStorage<string>("recording-component-s3-region", "");
const accessKeyIdAtom = atomWithStorage<string>("recording-component-s3-access-key-id", "");
const secretAccessKeyAtom = atomWithStorage<string>("recording-component-s3-secret-access-key", "");

const AddRecordingComponent: FC<Props> = ({ roomId, refetchIfNeeded }) => {
  const { roomApi } = useServerSdk();
  const [subscribeMode, setSubscribeMode] = useAtom(subscribeModeAtom);
  const [pathPrefix, setPathPrefix] = useAtom(pathPrefixAtom);

  const [useCustomCredentials, setUseCustomCredentials] = useState(false);
  const [bucket, setBucket] = useAtom(bucketAtom);
  const [region, setRegion] = useAtom(regionAtom);
  const [accessKeyId, setAccessKeyId] = useAtom(accessKeyIdAtom);
  const [secretAccessKey, setSecretAccessKey] = useAtom(secretAccessKeyAtom);
  const credentialProvided = !!(bucket && region && accessKeyId && secretAccessKey);

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div className="card-body p-4">
        <div className="grid grid-cols-3 gap-2 items-center justify-between">
          <label className="col-span-2 flex items-center gap-1">
            <span>Path prefix:</span>
            <input
              value={pathPrefix}
              onChange={(e) => setPathPrefix(e.target.value.trim())}
              className="input input-bordered flex-grow"
              placeholder="catalog1/catalog2"
            />
          </label>
          <label
            data-tip="Subscribe mode"
            className="flex justify-center gap-1 label cursor-pointer tooltip tooltip-info tooltip-top"
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
          <label className="flex align-center gap-2 col-span-2">
            Use custom S3 credentials:
            <input
              type="checkbox"
              className="checkbox"
              checked={useCustomCredentials}
              onChange={(e) => setUseCustomCredentials(e.target.checked)}
            />
          </label>
          <button
            disabled={useCustomCredentials ? !credentialProvided : false}
            onClick={() => {
              roomApi
                ?.addComponent(roomId, {
                  type: "recording",
                  options: {
                    pathPrefix: pathPrefix || undefined,
                    subscribeMode,
                    credentials: useCustomCredentials
                      ? {
                          accessKeyId,
                          bucket,
                          region,
                          secretAccessKey,
                        }
                      : undefined,
                  },
                })
                .then(() => {
                  refetchIfNeeded();
                })
                .catch((error) => {
                  showToastError(
                    error.response.data.errors ??
                      `Error occurred while creating the recording component. Please check the console for more details`,
                  );
                  console.error(error);
                });
            }}
            className="btn btn-success"
          >
            Start recording
          </button>
        </div>
        {useCustomCredentials && (
          <>
            <label className="col-span-2 flex items-center gap-1">
              <span>Bucket:</span>
              <input
                value={bucket}
                onChange={(e) => setBucket(e.target.value.trim())}
                className="input input-bordered flex-grow"
                placeholder="bucket-name"
              />
            </label>

            <label className="flex items-center gap-1">
              <span>Region:</span>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value.trim())}
                className="input input-bordered w-32"
                placeholder="eu-central-1"
              />
            </label>
            <label className="flex items-center gap-1 col-span-full">
              <span>Access key ID:</span>
              <input
                value={accessKeyId}
                onChange={(e) => setAccessKeyId(e.target.value.trim())}
                className="input input-bordered w-64"
                placeholder="AKIAIOSFODNN7EXAMPLE"
              />
            </label>
            <label className="flex items-center gap-1 col-start-1 col-span-2">
              <span>Secret access key:</span>
              <input
                value={secretAccessKey}
                onChange={(e) => setSecretAccessKey(e.target.value.trim())}
                className="input input-bordered flex-1"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default AddRecordingComponent;
