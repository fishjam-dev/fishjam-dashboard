import React, { FC } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Props = {
  roomId: string;
  refetchIfNeeded: () => void;
};

const urlAtom = atomWithStorage("rtsp-url", "");
const portAtom = atomWithStorage("rtsp-port", "7000");
const portAutoIncrementAtom = atomWithStorage("rtsp-port-auto-increment", true);
const keepAliveIntervalAtom = atomWithStorage("rtsp-keep-alive-interval", "");
const pierceNatAtom = atomWithStorage("rtsp-pierce-nat", true);
const reconnectDelayAtom = atomWithStorage("rtsp-reconnect-delay", "");

const AddRtspComponent: FC<Props> = ({ roomId, refetchIfNeeded }) => {
  const { roomApi } = useServerSdk();
  const [url, setUrl] = useAtom(urlAtom);

  const [port, setPort] = useAtom(portAtom);
  const parsedPort = parseInt(port);
  const [autoIncrement, setAutoIncrement] = useAtom(portAutoIncrementAtom);

  const [keepAliveInterval, setKeepAliveInterval] = useAtom(keepAliveIntervalAtom);
  const parsedKeepAliveInterval = parseInt(keepAliveInterval);

  const [pierceNat, setPierceNat] = useAtom(pierceNatAtom);

  const [reconnectDelay, setReconnectDelay] = useAtom(reconnectDelayAtom);
  const parsedReconnectDelay = parseInt(reconnectDelay);

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <div className="card-body p-4 mx-1">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value.trim())}
              className="input input-bordered w-full"
              placeholder="URL"
            />
            <div className="flex w-full gap-2">
              <input
                value={keepAliveInterval}
                onChange={(e) =>
                  e.target.value.match(/^[0-9]*$/) ? setKeepAliveInterval(e.target.value.trim()) : null
                }
                className="input input-bordered flex-1"
                placeholder="Keep alive interval"
              />
              <input
                value={reconnectDelay}
                onChange={(e) => (e.target.value.match(/^[0-9]*$/) ? setReconnectDelay(e.target.value.trim()) : null)}
                className="input input-bordered flex-1"
                placeholder="Reconnect delay"
              />
              <div className="flex flex-col justify-center tooltip" data-tip="Pierce NAT">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={pierceNat}
                  onChange={() => setPierceNat((prev) => !prev)}
                />
              </div>
            </div>
            <div className="flex w-full gap-2">
              <input
                value={port}
                onChange={(e) => setPort(e.target.value.trim())}
                className="input input-bordered flex-1"
                placeholder="Port"
              />
              <div className="flex flex-col justify-center tooltip" data-tip="Auto increment">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={autoIncrement}
                  onChange={() => setAutoIncrement((prev) => !prev)}
                />
              </div>
              <button
                disabled={url === "" || !parsedPort}
                onClick={() => {
                  roomApi
                    ?.addComponent(roomId, {
                      type: "rtsp",
                      options: {
                        rtpPort: parsedPort,
                        sourceUri: url,
                        keepAliveInterval: keepAliveInterval === "" ? undefined : parsedKeepAliveInterval,
                        pierceNat: pierceNat,
                        reconnectDelay: reconnectDelay === "" ? undefined : parsedReconnectDelay,
                      },
                    })
                    .then(() => {
                      refetchIfNeeded();
                    });
                  if (autoIncrement) {
                    setPort((parsedPort + 1).toString());
                  }
                }}
                className="btn btn-success"
              >
                Add RTSP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRtspComponent;
