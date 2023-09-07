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

export const refetchAtom = atom(false);
export const REFETCH_ON_SUCCESS = "refetch on success";
export const REFETCH_ON_MOUNT = "refetch on mount";
export const HLS_DISPLAY = "display HLS";
export const SERVER_STATE = "server state";

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

  const { roomApi } = useServerSdk();

  const { refetchRoomsIfNeeded, refetchRooms } = useApi();

  const [show, setShow] = useState<boolean>(false);
  const [showEvents, setShowEvents] = useState<boolean>(false);

  useEffect(() => {
    if (refetchDemand) {
      refetchRooms();
    }
  }, [refetchDemand, refetchRooms]);

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
      <div className="tabs gap-2 tabs-boxed">
        {state.rooms === null && <div>...</div>}
        {Object.values(state.rooms || {}).map((room) => {
          return (
            <div key={room.id} className="indicator">
              <CloseButton
                position={"left"}
                onClick={() => {
                  roomApi?.jellyfishWebRoomControllerDelete(room.id).then(() => {
                    const LOCAL_STORAGE_KEY = `tokenList-${room.id}`;
                    removeSavedItem(LOCAL_STORAGE_KEY);
                    refetchRoomsIfNeeded();
                  });
                }}
              />
              <a
                className={`tab bg-gray-50 text-gray-500 hover:text-black tab-bordered tab-lg ${
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
