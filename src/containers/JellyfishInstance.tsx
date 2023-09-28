import { Room } from "./Room";
import { useServerSdk } from "../components/ServerSdkContext";
import { removeSavedItem } from "../utils/localStorageUtils";
import { CloseButton } from "../components/CloseButton";
import { useStore } from "./RoomsContext";
import { useApi } from "./Api";
import { JsonComponent } from "../components/JsonComponent";
import CreateRoom from "../components/CreateRoom";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ServerEvents } from "../components/ServerEvents";
import { autoRefetchServerStateAtom } from "./Dashboard";
import { Link, useLocation } from "react-router-dom";

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

  const { roomApi, signalingPath, signalingProtocol, serverToken } = useServerSdk();

  const { refetchRoomsIfNeeded, refetchRooms } = useApi();

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

  const room = state.selectedRoom !== null ? state.rooms[state.selectedRoom] : null;

  return (
    <div className={`flex flex-col w-full-no-scrollbar h-full box-border items-start gap-1 ${active ? "" : "hidden"}`}>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4">
          <div className="flex flex-row">
            <div className="card-title">
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
                to={`./servers/${host}/internals?${urlParams(signalingProtocol, signalingPath, serverToken)}`}
                className="btn btn-sm mx-1 my-0"
                target="_blank"
              >
                Internals
              </Link>
            </div>
          </div>
        </div>
        <div className="h-full">
          <div className="flex flex-row justify-start"></div>
          <ServerEvents displayed={showEvents} />
          {show && (
            <div className="mt-2">
              <JsonComponent state={state.rooms} />
            </div>
          )}
        </div>
      </div>
      <div className="tabs gap-2 tabs-boxed p-0 items-stretch">
        {state.rooms === null && <div>...</div>}
        {Object.values(state.rooms || {}).map((room) => {
          return (
            <div key={room.id} className="indicator">
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
              <a
                className={`h-full tab bg-gray-50 text-gray-500 hover:text-black tab-bordered tab-lg ${
                  state.selectedRoom === room.id ? "tab-active" : ""
                }`}
                onClick={() => {
                  dispatch({ type: "SET_ACTIVE_ROOM", roomId: room.id });
                }}
              >
                {room.id}
              </a>
            </div>
          );
        })}
        <CreateRoom refetchIfNeeded={refetchRoomsIfNeeded} host={host} key={host} />
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
