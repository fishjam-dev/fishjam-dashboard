import { Room } from "./Room";
import { useServerSdk } from "../components/ServerSdkContext";
import { removeSavedItem } from "../utils/localStorageUtils";
import { CloseButton } from "../components/CloseButton";
import { useStore } from "./RoomsContext";
import { useApi } from "./Api";
import HLSPlayback from "../components/HLSPlayback";
import { JsonComponent } from "../components/JsonComponent";
import CreateRoom from "../components/CreateRoom";
import { atom, useAtom } from "jotai";
import { extraSelectorAtom } from "../components/LogSelector";

export const refetchAtom = atom(false);
export const REFETCH_ON_SUCCESS = "refetch on success";
export const REFETCH_ON_MOUNT = "refetch on mount";
export const HLS_DISPLAY = "display HLS";
export const SERVER_STATE = "server state";

export const App = () => {
  const { state, dispatch } = useStore();
  const [refetchRequested] = useAtom(refetchAtom);

  const { roomApi } = useServerSdk();

  const { refetchRoomsIfNeeded } = useApi();
  const [HLS] = useAtom(extraSelectorAtom(HLS_DISPLAY));
  const [SERVER] = useAtom(extraSelectorAtom(SERVER_STATE));

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
                className={`tab tab-bordered border-l-2 tab-lg ${state.selectedRoom === room.id ? "tab-active" : ""}`}
                onClick={() => {
                  dispatch({ type: "SET_ACTIVE_ROOM", roomId: room.id });
                }}
              >
                {room.id}
              </a>
            </div>
          );
        })}
        <CreateRoom refetchIfNeeded={refetchRoomsIfNeeded} />
      </div>
      <div className="flex flex-row m-2 h-full items-start">
        {Object.values(state?.rooms || {}).map((room) => (
          <Room
            key={room.id}
            roomId={room.id || ""}
            initial={room.roomStatus}
            refetchIfNeeded={refetchRoomsIfNeeded}
            refetchRequested={refetchRequested}
            hidden={state.selectedRoom !== room.id}
          />
        ))}
      </div>
      <div className="flex flex-row">
        {HLS && <HLSPlayback />}
        {SERVER && (
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
