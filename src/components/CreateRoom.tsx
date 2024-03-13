import React, { ChangeEvent, FC, useEffect } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { showToastError, showToastInfo } from "./Toasts";
import { pathAtom, isWssAtom, serverTokenAtom, serversAtom, isHttpsAtom } from "../containers/Dashboard";
import { isValidJellyfishWebhookUrl } from "../utils/url";
import clsx from "clsx";

type Props = {
  refetchIfNeeded: () => void;
  host: string;
};

type EnforceEncoding = "h264" | "vp8";
const videoCodecAtomFamily = atomFamily((host: string) =>
  atomWithStorage<EnforceEncoding | null>(`enforce-encoding-${host}`, null),
);

const maxPeersAtom = atomFamily((host: string) => atomWithStorage(`max-peers-${host}`, "10"));
const peerlessPurgeAtom = atomFamily((host: string) => atomWithStorage<number | null>(`peerless-purge-${host}`, null));
const webhookUrlAtom = atomWithStorage<string | null>("webhook-url", null);
const roomIdAtom = atomFamily((host: string) => atomWithStorage<string | null>(`room-id-${host}`, null));
const roomIdAutoIncrementCheckboxAtom = atomWithStorage("room-id-auto-increment", true, undefined, { getOnInit: true });
const roomIdAutoIncrementValueAtom = atomWithStorage("room-id-auto-increment-value", 0);
const roomIdInputAtom = atomWithStorage<string>("room-id-input", "");

export const roomsOrderAtom = atomWithStorage<Record<string, number>>("rooms-order", {});
const roomCounterAtom = atomWithStorage<number>("last-room-id", 0);

const isRoomEnforceEncoding = (value: string): value is EnforceEncoding => value === "h264" || value === "vp8";

export const CreateRoom: FC<Props> = ({ refetchIfNeeded, host }) => {
  const { roomApi, currentURISchema } = useServerSdk();
  const [videoCodec, setEnforceEncodingInput] = useAtom(videoCodecAtomFamily(host));
  const [maxPeers, setMaxPeers] = useAtom(maxPeersAtom(host));
  const [peerlessPurge, setPeerlessPurge] = useAtom(peerlessPurgeAtom(host));

  const [webhookUrl, setWebhookUrl] = useAtom(webhookUrlAtom);

  const setRoomOrder = useSetAtom(roomsOrderAtom);
  const [roomCounter, setRoomCounter] = useAtom(roomCounterAtom);

  const [roomId, setRoomId] = useAtom(roomIdAtom(host));
  const [roomIdInput, setRoomIdInput] = useAtom(roomIdInputAtom);
  const [roomIdAutoIncrementCheckbox, setRoomIdAutoIncrementCheckbox] = useAtom(roomIdAutoIncrementCheckboxAtom);
  const [roomIdAutoIncrementValue, setRoomIdAutoIncrementValue] = useAtom(roomIdAutoIncrementValueAtom);

  const parsedMaxPeers = parseInt(maxPeers);
  const setJellyfishServers = useSetAtom(serversAtom);
  const protocol = useAtomValue(isWssAtom);
  const apiRequestProtocol = useAtomValue(isHttpsAtom);
  const path = useAtomValue(pathAtom);
  const serverToken = useAtomValue(serverTokenAtom);

  const addServer = (httpProtocol: string, host: string) => {
    setJellyfishServers((current) => {
      const id = `${httpProtocol}://${host}${path}`;

      return {
        ...current,
        [id]: {
          id,
          host,
          isWss: protocol,
          isHttps: apiRequestProtocol,
          path,
          serverToken,
          refetchDemand: true,
          active: false,
        },
      };
    });
  };
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnforceEncodingInput(isRoomEnforceEncoding(event.target.value) ? event.target.value : null);
  };

  const onChangeAutoIncrement = () => {
    if (!roomIdAutoIncrementCheckbox) {
      setRoomId(roomIdAutoIncrementValue.toString());
    }
    setRoomIdAutoIncrementCheckbox(!roomIdAutoIncrementCheckbox);
  };

  const onChangeWebhookUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setWebhookUrl(event.target.value === "" ? null : event.target.value.trim());
  };

  useEffect(() => {
    if (roomIdAutoIncrementCheckbox) {
      setRoomId(roomIdAutoIncrementValue.toString());
      setRoomIdInput(roomIdAutoIncrementValue.toString());
    }
  }, [roomIdAutoIncrementCheckbox, roomIdAutoIncrementValue, setRoomId, setRoomIdInput]);

  const onChangeRoomIdInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setRoomIdInput(value);

    setRoomId(value === "" ? null : value);

    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      setRoomIdAutoIncrementValue(parsedValue);
    }
  };

  const isWebhookUrlOk = webhookUrl ? isValidJellyfishWebhookUrl(webhookUrl) : true;

  return (
    <div className="card bg-base-100 shadow-xl indicator">
      <div className="card-body py-1 px-3 flex flex-col">
        <div className="flex flex-row items-center justify-between">
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
          <label className="m-1 flex gap-2">
            <span className="label">Max Peers:</span>
            <input
              type="text"
              placeholder="Max peers"
              className="input input-bordered w-36 h-10"
              value={maxPeers}
              onChange={(e) => /^\d*$/.test(e.target.value) ? setMaxPeers(e.target.value) : null}
            />
          </label>
          <label className="m-1 flex gap-2">
            <span className="label">Peerless purge duration (seconds)</span>
            <input
              type="text"
              placeholder="Purge duration"
              className="input input-bordered w-36 h-10"
              value={peerlessPurge ?? ""}
              onChange={(e) => /^\d*$/.test(e.target.value) && setPeerlessPurge(parseInt(e.target.value) || null)}
            />
          </label>
          <button
            className="btn btn-sm btn-success btn-circle m-1 tooltip tooltip-success"
            data-tip="Create room"
            onClick={() => {
              if (roomIdAutoIncrementCheckbox) {
                setRoomIdAutoIncrementValue((prev) => {
                  if (isNaN(prev)) return 0;
                  if (prev >= Number.MAX_SAFE_INTEGER) return 0;
                  return prev + 1;
                });
              }
              const currentRoomCounter = roomCounter;
              setRoomCounter((prev) => (prev >= Number.MAX_SAFE_INTEGER ? 0 : prev + 1));
              roomApi
                ?.createRoom({
                  roomId: roomId || undefined,
                  webhookUrl: webhookUrl || undefined,
                  maxPeers: isNaN(parsedMaxPeers) ? undefined : parsedMaxPeers,
                  videoCodec: videoCodec ?? undefined,
                  peerlessPurgeTimeout: peerlessPurge ?? undefined,    
                })
                .then((response) => {
                  if (host !== response.data.data.jellyfish_address) {
                    const protocol = currentURISchema ?? "http";

                    showToastInfo(`Room created on ${protocol}://${response.data.data.jellyfish_address}`);

                    addServer(protocol, response.data.data.jellyfish_address);
                  }
                  refetchIfNeeded();
                  setRoomOrder((prev) => {
                    const copy = { ...prev };
                    copy[response.data.data.room.id] = currentRoomCounter;
                    return copy;
                  });
                })
                .catch((e) => {
                  showToastError(
                    e.response.data.errors ??
                      `Error occurred while creating the room. Please check the console for more details`,
                  );
                  console.error(e);
                });
            }}
          >
            +
          </button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row gap-2 items-center">
            <span className="text">Room id:</span>

            <input
              type="text"
              placeholder="Room id"
              className="input input-bordered h-10 m-1"
              disabled={roomIdAutoIncrementCheckbox}
              value={roomIdInput || ""}
              onChange={onChangeRoomIdInput}
            />
          </div>

          <div className="flex flex-col justify-center tooltip" data-tip="Auto increment room ID">
            <input
              className="checkbox"
              type="checkbox"
              checked={roomIdAutoIncrementCheckbox}
              onChange={onChangeAutoIncrement}
            />
          </div>

          <div className="flex flex-row gap-2 items-center">
            <label className="text">Webhook URL</label>
            <input
              type="text"
              placeholder="Webhook URL"
              className={clsx("input input-bordered h-10 m-1", !isWebhookUrlOk && "input-error")}
              value={webhookUrl || ""}
              onChange={onChangeWebhookUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
