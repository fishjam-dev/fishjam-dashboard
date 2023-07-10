import React, { useState } from "react";
import { Room } from "./Room";
import type { StreamInfo } from "../components/VideoDeviceSelector";
import { useSettings } from "../components/ServerSdkContext";
import { removeSavedItem } from "../utils/localStorageUtils";
import { CloseButton } from "../components/CloseButton";
import { useStore } from "./RoomsContext";
import { useApi } from "./Api";

export const REFETCH_ON_SUCCESS = "refetch on success";
export const REFETCH_ON_MOUNT = "refetch on mount";

export const App = () => {
  const { state, dispatch } = useStore();
  const [selectedVideoStream, setSelectedVideoStream] = useState<StreamInfo | null>(null);

  const { roomApi } = useSettings();

  const [serverMessages, setServerMessages] = useState<{ data: unknown; id: string }[]>([]);

  const { refetchRooms, refetchRoomsIfNeeded } = useApi();

  return (
    <div className="flex flex-col w-full-no-scrollbar h-full box-border pt-4">
      <div className="tabs m-2 ">
        {state.rooms === null && <div>...</div>}
        {Object.values(state.rooms || {}).map((room) => {
          return (
            <div key={room.id} className="indicator">
              <CloseButton
                onClick={() => {
                  roomApi?.jellyfishWebRoomControllerDelete(room.id).then((response) => {
                    console.log({ name: "removeRoom", response });
                    const LOCAL_STORAGE_KEY = `tokenList-${room.id}`;
                    removeSavedItem(LOCAL_STORAGE_KEY);
                    refetchRoomsIfNeeded();
                  });
                }}
              />
              <a
                className={`tab tab-lifted tab-lg ${state.selectedRoom === room.id ? "tab-active" : ""}`}
                onClick={() => {
                  dispatch({ type: "SET_ACTIVE_ROOM", roomId: room.id });
                }}
              >
                {room.id}
              </a>
            </div>
          );
        })}

        <button
          className="btn btn-sm btn-success btn-circle m-2"
          onClick={() => {
            roomApi?.jellyfishWebRoomControllerCreate({ maxPeers: 10 }).then(() => {
              refetchRoomsIfNeeded();
            });
          }}
        >
          +
        </button>
      </div>
      <div className="flex flex-row m-2 h-full items-start">
        {/*<div>*/}
        {/*  <div className="w-[600px] m-2 card bg-base-100 shadow-xl">*/}
        {/*    <div className="card-body">*/}
        {/*      <h2 className="card-title">Server state:</h2>*/}
        {/*      <JsonComponent state={state.rooms} />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {Object.values(state?.rooms || {})
          ?.filter((room) => room.id === state.selectedRoom)
          .map((room) => (
            <Room
              key={room.id}
              roomId={room.id || ""}
              initial={room.roomStatus}
              refetchIfNeeded={refetchRoomsIfNeeded}
              selectedVideoStream={selectedVideoStream}
            />
          ))}
      </div>
    </div>
  );
};

export default App;
