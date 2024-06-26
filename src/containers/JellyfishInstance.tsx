import { Room } from "./Room";
import { useServerSdk } from "../components/ServerSdkContext";
import { removeSavedItem } from "../utils/localStorageUtils";
import { CloseButton } from "../components/CloseButton";
import { RoomState, useStore } from "./RoomsContext";
import { useApi } from "./Api";
import { JsonComponent } from "../components/JsonComponent";
import CreateRoom, { roomsOrderAtom } from "../components/CreateRoom";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ServerEvents } from "../components/ServerEvents";
import { autoRefetchServerStateAtom } from "./Dashboard";
import { Link } from "react-router-dom";
import clsx from "clsx";

export const refetchAtom = atom(false);
export const REFETCH_ON_SUCCESS = "refetch on success";
export const REFETCH_ON_MOUNT = "refetch on mount";
export const HLS_DISPLAY = "display HLS";
export const SERVER_STATE = "server state";

const urlParams = (signalingProtocol: string | null, signalingPath: string | null, serverToken: string | null) => {
  const params = new URLSearchParams({
    secure: signalingProtocol === "wss" ? "true" : "false",
    socket: signalingPath?.replace("peer", "server") || "",
    token: serverToken || "",
  });

  return params.toString();
};

export const JellyfishInstance = ({
  host,
  refetchDemand,
  active,
}: {
  host: string;
  refetchDemand: boolean;
  active: boolean;
}) => {
  const { state, dispatch } = useStore();
  const [refetchRequested] = useAtom(refetchAtom);

  const { roomApi, signalingPath, signalingURISchema, serverToken } = useServerSdk();

  const { refetchRoomsIfNeeded, refetchRooms, allRooms } = useApi();

  const [show, setShow] = useState<boolean>(false);
  const [showEvents, setShowEvents] = useState<boolean>(false);
  const [autoRefetchServerState] = useAtom(autoRefetchServerStateAtom);

  useEffect(() => {
    if (refetchDemand) {
      refetchRooms();
    }
  }, [refetchDemand, refetchRooms]);

  useEffect(() => {
    if (!autoRefetchServerState) return;

    const intervalId = setInterval(() => {
      refetchRooms();
    }, 2000);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefetchServerState, refetchRooms]);

  const [roomOrder] = useAtom(roomsOrderAtom);

  const roomStateComparator = (roomState1: RoomState, roomState2: RoomState) => {
    const roomId1: number | undefined = roomOrder[roomState1.id];
    const roomId2: number | undefined = roomOrder[roomState2.id];

    if (roomId1 === undefined) return -1;
    if (roomId2 === undefined) return 1;

    return roomId1 - roomId2;
  };

  const room = state.selectedRoom !== null ? state.rooms[state.selectedRoom] : null;

  return (
    <div className={`flex flex-col w-full-no-scrollbar h-full box-border items-start gap-1 ${active ? "" : "hidden"}`}>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4">
          <div className="flex flex-row">
            <div className="card-title flex flex-row flex-wrap items-start items-center">
              Jellyfish: <span className="text-xs">{host}</span>
              <button
                className="btn btn-sm btn-info mx-1 my-0"
                onClick={() => {
                  refetchRooms();
                }}
              >
                Refetch server
              </button>
              <button
                className="btn btn-sm mx-1 my-0"
                onClick={() => {
                  setShow(!show);
                }}
              >
                {show ? "Hide" : "Show"} server state
              </button>
              <button
                className="btn btn-sm mx-1 my-0"
                onClick={() => {
                  setShowEvents(!showEvents);
                }}
              >
                {showEvents ? "Hide" : "Show"} server events
              </button>
              <Link
                to={`./servers/${host}/internals?${urlParams(signalingURISchema, signalingPath, serverToken)}`}
                className="btn btn-sm mx-1 my-0"
                target="_blank"
              >
                Internals
              </Link>
            </div>
          </div>
        </div>
        <div className="h-full">
          <ServerEvents displayed={showEvents} />
          {show && (
            <div className="mt-2">
              <JsonComponent state={allRooms} />
            </div>
          )}
        </div>
      </div>
      <CreateRoom refetchIfNeeded={refetchRoomsIfNeeded} host={host} key={host} />
      <div className="tabs tabs-bordered tabs-lg gap-2 tabs-boxed flex flex-wrap p-0 items-stretch" role="tablist">
        {state.rooms === null && <div>...</div>}
        {Object.values(state.rooms || {})
          .sort(roomStateComparator)
          .map((room) => (
            <button
              key={room.id}
              className={clsx(
                "indicator bg-gray-50 text-gray-500 hover:text-black tab",
                state.selectedRoom === room.id && "tab-active",
              )}
              role="tab"
              onClick={() => {
                dispatch({ type: "SET_ACTIVE_ROOM", roomId: room.id });
              }}
            >
              <CloseButton
                position={"left"}
                onClick={() => {
                  roomApi?.deleteRoom(room.id).then(() => {
                    const LOCAL_STORAGE_KEY = `tokenList-${room.id}`;
                    removeSavedItem(LOCAL_STORAGE_KEY);
                    refetchRoomsIfNeeded();
                  });
                }}
              />
              {room.id}
            </button>
          ))}
      </div>
      <div className="room-wrapper flex flex-row h-full items-start">
        {room && (
          <Room
            key={room.id}
            roomId={room.id || ""}
            initial={room.roomStatus}
            refetchIfNeeded={refetchRoomsIfNeeded}
            refetchRequested={refetchRequested}
          />
        )}
      </div>
    </div>
  );
};

export default JellyfishInstance;
