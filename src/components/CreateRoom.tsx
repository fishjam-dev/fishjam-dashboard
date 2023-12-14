import React, { ChangeEvent, FC } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { useAtom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { showToastInfo } from "./Toasts";
import { pathAtom, isWssAtom, serverTokenAtom, serversAtom, isHttpsAtom } from "../containers/Dashboard";

type Props = {
  refetchIfNeeded: () => void;
  host: string;
};

type EnforceEncoding = "h264" | "vp8";
const videoCodecAtomFamily = atomFamily((host: string) =>
  atomWithStorage<EnforceEncoding | null>(`enforce-encoding-${host}`, null),
);

const maxPeersAtom = atomFamily((host: string) => atomWithStorage(`max-peers-${host}`, "10"));

const isRoomEnforceEncoding = (value: string): value is EnforceEncoding => value === "h264" || value === "vp8";

export const CreateRoom: FC<Props> = ({ refetchIfNeeded, host }) => {
  const { roomApi } = useServerSdk();
  const [videoCodec, setEnforceEncodingInput] = useAtom(videoCodecAtomFamily(host));
  const [maxPeers, setMaxPeers] = useAtom(maxPeersAtom(host));
  const parsedMaxPeers = parseInt(maxPeers);
  const [_, setJellyfishServers] = useAtom(serversAtom);
  const [protocol] = useAtom(isWssAtom);
  const [apiRequestProtocol] = useAtom(isHttpsAtom);
  const path = useAtom(pathAtom);
  const serverToken = useAtom(serverTokenAtom);

  const addServer = (host: string) => {
    setJellyfishServers((current) => {
      return {
        ...current,
        [host]: {
          host: host,
          isWss: protocol,
          isHttps: apiRequestProtocol,
          path: path[0],
          serverToken: serverToken[0],
          refetchDemand: true,
          active: false,
        },
      };
    });
  };
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnforceEncodingInput(isRoomEnforceEncoding(event.target.value) ? event.target.value : null);
  };

  return (
    <div className="card bg-base-100 shadow-xl indicator">
      <div className="card-body flex flex-row px-3 py-1 items-center">
        <div className="flex flex-row items-center gap-2">
          <span>Enforce codec:</span>
          <div className="form-control">
            <label className="flex flex-row gap-2 label cursor-pointer items-center tooltip" data-tip="Enforce codec">
              <input
                type="radio"
                name={host}
                value="default"
                className="radio"
                onChange={onChange}
                checked={videoCodec === null}
              />
              <span className="label-text">none</span>
            </label>
          </div>
          <div className="form-control">
            <label className="flex flex-row gap-2 label cursor-pointer items-center">
              <input
                type="radio"
                name={host}
                value="h264"
                className="radio"
                onChange={onChange}
                checked={videoCodec === "h264"}
              />
              <span className="label-text">h264</span>
            </label>
          </div>
          <div className="form-control">
            <label className="flex flex-row gap-2 label cursor-pointer">
              <input
                type="radio"
                name={host}
                value="vp8"
                className="radio"
                onChange={onChange}
                checked={videoCodec === "vp8"}
              />
              <span className="label-text">vp8</span>
            </label>
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <span className="text">Max Peers:</span>
          <input
            type="text"
            placeholder="Max peers"
            className="input input-bordered w-36 h-10 m-1"
            value={maxPeers}
            onChange={(e) => (e.target.value.match(/^[0-9]*$/) ? setMaxPeers(e.target.value.trim()) : null)}
          />
        </div>
        <button
          className="btn btn-sm btn-success btn-circle m-1 tooltip tooltip-success"
          data-tip="Create room"
          onClick={() => {
            roomApi
              ?.createRoom({
                maxPeers: isNaN(parsedMaxPeers) ? undefined : parsedMaxPeers,
                videoCodec: videoCodec ?? undefined,
              })
              .then((response) => {
                if (host !== response.data.data.jellyfish_address) {
                  showToastInfo(`Room created on ${response.data.data.jellyfish_address}`);
                  addServer(response.data.data.jellyfish_address);
                }
                refetchIfNeeded();
              });
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
