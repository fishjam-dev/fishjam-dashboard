import React, { useCallback, useEffect, useState } from "react";
import { useLocalStorageState } from "../components/LogSelector";
import { REFETCH_ON_SUCCESS } from "./App";
import { JsonComponent } from "../components/JsonComponent";
import { Client } from "./Client";
import type { StreamInfo } from "../components/StreamingDeviceSelector";
import { CopyToClipboardButton } from "../components/CopyButton";
import { Peer, Room as RoomAPI } from "../server-sdk";
import { useSettings } from "../components/ServerSdkContext";
import { getBooleanValue, loadObject, saveObject } from "../utils/localStorageUtils";
import { useStore } from "./RoomsContext";

type RoomConfig = {
  maxPeers: number;
};

export type RoomType = {
  components: unknown;
  config: RoomConfig;
  id: string;
  peers: Peer[];
};

type RoomProps = {
  roomId: string;
  initial: RoomAPI;
  refetchIfNeeded: () => void;
  selectedVideoStream: StreamInfo | null;
};

export const Room = ({ roomId, refetchIfNeeded }: RoomProps) => {
  const { state, dispatch } = useStore();

  const [show, setShow] = useLocalStorageState(`show-json-${roomId}`);
  const [token, setToken] = useState<Record<string, string>>({});
  const { roomApi, peerApi } = useSettings();
  const room = state.rooms[roomId];

  const refetch = () => {
    roomApi?.jellyfishWebRoomControllerShow(roomId).then((response) => {
      dispatch({ type: "UPDATE_ROOM", room: response.data.data });
      // setRoom(response.data.data);
    });
  };

  const refetchIfNeededInner = () => {
    if (getBooleanValue(REFETCH_ON_SUCCESS)) {
      refetchIfNeeded();
      refetch();
    }
  };

  const LOCAL_STORAGE_KEY = `tokenList-${roomId}`;

  useEffect(() => {
    setToken(loadObject(LOCAL_STORAGE_KEY, {}));
  }, [LOCAL_STORAGE_KEY]);

  const removeToken = useCallback(
    (peerId: string) => {
      setToken((prev) => {
        const tokenMap = { ...prev };
        delete tokenMap[peerId];
        saveObject(LOCAL_STORAGE_KEY, tokenMap);
        return tokenMap;
      });
    },
    [LOCAL_STORAGE_KEY],
  );

  const addToken = useCallback(
    (peerId: string, token: string) => {
      setToken((prev) => {
        const tokenMap = { ...prev, [peerId]: token };
        saveObject(LOCAL_STORAGE_KEY, tokenMap);
        return tokenMap;
      });
    },
    [LOCAL_STORAGE_KEY],
  );

  return (
    <div className="flex flex-col items-start mr-4 w-full">
      <div className="w-full m-2 card bg-base-100 shadow-xl">
        <div className="card-body p-4">
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="card-title">
                Room: <span className="text-xs">{roomId}</span>
                <CopyToClipboardButton text={roomId} />
                <button
                  className="btn btn-sm btn-info mx-1 my-0"
                  onClick={() => {
                    refetch();
                  }}
                >
                  Refetch
                </button>
                <button
                  className="btn btn-sm btn-success mx-1 my-0"
                  onClick={() => {
                    peerApi
                      ?.jellyfishWebPeerControllerCreate(roomId, { type: "webrtc" })
                      .then((response) => {
                        addToken(response.data.data.peer.id, response.data.data.token);
                      })
                      .then(() => {
                        refetchIfNeededInner();
                      });
                  }}
                >
                  Create peer
                </button>
                <button
                  className="btn btn-sm mx-1 my-0"
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  {show ? "Hide" : "Show"} room state
                </button>
              </div>
            </div>
          </div>
          <div className="h-full">
            <div className="flex flex-row justify-start"></div>

            {show && (
              <div className="mt-2">
                <JsonComponent state={room} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start">
        <div className="flex flex-row flex-wrap">
          {Object.values(room?.peers || {}).map(({ id }) => {
            if (!id) return null;
            return (
              <Client
                key={id}
                roomId={roomId}
                peerId={id}
                token={token[id] || null}
                name={id}
                refetchIfNeeded={refetchIfNeededInner}
                remove={() => {
                  peerApi?.jellyfishWebPeerControllerDelete(roomId, id);
                }}
                removeToken={() => {
                  removeToken(id);
                }}
                setToken={(token: string) => {
                  addToken(id, token);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
