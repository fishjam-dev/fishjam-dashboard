import { Room } from "./Room";
import { useSettings } from "../components/ServerSdkContext";
import { getBooleanValue, removeSavedItem } from "../utils/localStorageUtils";
import { CloseButton } from "../components/CloseButton";
import { useStore } from "./RoomsContext";
import { useApi } from "./Api";
import HLSPlayback from "../components/HLSPlayback";
import { JsonComponent } from "../components/JsonComponent";
import { useState } from "react";

export const REFETCH_ON_SUCCESS = "refetch on success";
export const REFETCH_ON_MOUNT = "refetch on mount";
export const HLS_DISPLAY = "hls display";
export const SERVER_STATE = "server state";

export const App = () => {
  const { state, dispatch } = useStore();

  const { roomApi } = useSettings();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const { refetchRoomsIfNeeded } = useApi();
  return (
    <div className="flex flex-col w-full-no-scrollbar h-full box-border pt-4">
      <div className="tabs tabs-boxed m-2">
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
                className={`tab tab-lifted tab-lg ${state.selectedRoom === room.id ? "tab-active" : ""}`}
                onClick={() => {
                  setSelectedRoom(room.id);
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
        {Object.values(state?.rooms || {})
          ?.filter((room) => room.id === state.selectedRoom)
          .map((room) => (
            <Room
              selectedRoom={selectedRoom}
              key={room.id}
              roomId={room.id || ""}
              initial={room.roomStatus}
              refetchIfNeeded={refetchRoomsIfNeeded}
            />
          ))}
      </div>
      <div className="flex flex-row">
        {getBooleanValue(HLS_DISPLAY) && <HLSPlayback />}
        {getBooleanValue(SERVER_STATE) && (
          <div>
            <div className="w-[600px] h-[700px] m-2 card bg-base-100 shadow-xl overflow-auto">
              <div className="card-body">
                <h2 className="card-title">Server state:</h2>
                <JsonComponent state={state.rooms} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
