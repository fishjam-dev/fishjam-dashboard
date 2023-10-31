import React, { useCallback, useEffect, useState } from "react";
import { useLocalStorageState } from "../components/LogSelector";
import { REFETCH_ON_SUCCESS } from "./JellyfishInstance";
import { JsonComponent } from "../components/JsonComponent";
import { Client } from "./Client";
import { CopyToClipboardButton } from "../components/CopyButton";
import { Peer, Room as RoomAPI } from "../server-sdk";
import { useServerSdk } from "../components/ServerSdkContext";
import { getBooleanValue, loadObject, saveObject } from "../utils/localStorageUtils";
import { useStore } from "./RoomsContext";
import AddRtspComponent from "../components/AddRtspComponent";
import AddHlsComponent from "../components/AddHlsComponent";
import ComponentsInRoom from "../components/ComponentsInRoom";
import { useApi } from "./Api";
import { useAtom } from "jotai/index";
import { autoRefetchActiveRoomAtom } from "./Dashboard";

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
  refetchRequested: boolean;
};

export const Room = ({ roomId, refetchIfNeeded, refetchRequested }: RoomProps) => {
  const { state, dispatch } = useStore();

  const [showRoomState, setShowRoomState] = useLocalStorageState(`show-room-json-${roomId}`);
  const [showComponents, setShowComponents] = useLocalStorageState(`show-components-${roomId}`);
  const [token, setToken] = useState<Record<string, string>>({});
  const { roomApi } = useServerSdk();
  const [roomState, setRoomState] = useState<RoomAPI | null>(null);
  const { refetchRooms } = useApi();
  const room = state.rooms[roomId];

  const [autoRefetchActiveRoomState] = useAtom(autoRefetchActiveRoomAtom);

  const refetch = useCallback(() => {
    roomApi
      ?.getRoom(roomId)
      .then((response) => {
        dispatch({ type: "UPDATE_ROOM", room: response.data.data });
        setRoomState(response.data.data);
      })
      .catch(() => {
        refetchRooms();
      });
  }, [refetchRooms, dispatch, roomApi, roomId]);

  useEffect(() => {
    if (!autoRefetchActiveRoomState) return;

    const intervalId = setInterval(() => {
      refetch();
    }, 2000);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefetchActiveRoomState, refetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const refetchIfNeededInner = () => {
    if (getBooleanValue(REFETCH_ON_SUCCESS)) {
      refetchIfNeeded();
      refetch();
    }
  };

  // serious question what to do here
  // there must be a better way to do this
  useEffect(() => {
    roomApi?.getRoom(roomId).then((response) => {
      dispatch({ type: "UPDATE_ROOM", room: response.data.data });
      // setRoom(response.data.data);
    });
  }, [dispatch, refetchRequested, roomApi, roomId]);

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
    <div className="flex flex-col items-start w-full gap-1">
      <div className="card bg-base-100 shadow-xl">
        <div className="flex flex-1 card-body p-4 ">
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
                  roomApi
                    ?.addPeer(roomId, { type: "webrtc", options: { enableSimulcast: true } })
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
                  setShowRoomState(!showRoomState);
                }}
              >
                {showRoomState ? "Hide" : "Show"} room state
              </button>
              <button
                className="btn btn-sm mx-1 my-0"
                onClick={() => {
                  setShowComponents(!showComponents);
                }}
              >
                {showComponents ? "Hide" : "Show"} components
              </button>
            </div>
          </div>
        </div>
        <div className="h-full">
          <div className="flex flex-row justify-start"></div>

          {showRoomState && (
            <div className="mt-2">
              <JsonComponent state={roomState} />
            </div>
          )}
        </div>
      </div>
      {showComponents && (
        <div className="flex flex-row gap-2 items-start">
          <div className="flex flex-col w-150 gap-1">
            <AddRtspComponent roomId={roomId} refetchIfNeeded={refetchIfNeededInner} />
            <AddHlsComponent
              hasHlsComponent={room.roomStatus.components.some((component) => component.type === "hls")}
              roomId={roomId}
              refetchIfNeeded={refetchIfNeededInner}
              isHLSSupported={room.roomStatus.config.videoCodec === "h264"}
            />
          </div>
          <div className="flex flex-col w-150 gap-1">
            <ComponentsInRoom components={room?.roomStatus?.components} refetchIfNeeded={refetchIfNeededInner} />
          </div>
        </div>
      )}
      <div className="flex flex-row flex-wrap items-start gap-2">
        {Object.values(room?.peers || {}).map(({ id }) => {
          if (!id) return null;
          return (
            <Client
              key={id}
              roomId={roomId}
              peerId={id}
              token={token[id] || null}
              id={id}
              refetchIfNeeded={refetchIfNeededInner}
              remove={() => {
                roomApi?.deletePeer(roomId, id);
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
  );
};
