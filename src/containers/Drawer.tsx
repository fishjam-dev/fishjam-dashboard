import App, { REFETCH_ON_MOUNT, REFETCH_ON_SUCCESS, HLS_DISPLAY, SERVER_STATE, refetchAtom } from "./App";
import {
  DEFAULT_HOST,
  DEFAULT_PATH,
  DEFAULT_PROTOCOL,
  DEFAULT_TOKEN,
  useServerSdk,
} from "../components/ServerSdkContext";
import { useApi } from "./Api";
import { ThemeSelector } from "../components/ThemeSelector";
import { GiHamburgerMenu } from "react-icons/gi";
import { LogSelector, PersistentExtras, PersistentInput } from "../components/LogSelector";
import { useAtom } from "jotai";

export const Drawer = () => {
  const {
    setSignalingProtocol,
    signalingProtocol,
    setSignalingHost,
    signalingHost,
    setSignalingPath,
    signalingPath,
    serverToken,
    setServerToken,
  } = useServerSdk();
  const { refetchRooms } = useApi();
  const [, setRefetchRequested] = useAtom(refetchAtom);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ml-3 flex flex-row">
        <label htmlFor="my-drawer" className="btn drawer-button mr-3">
          <GiHamburgerMenu size={24} />
        </label>
        {/*  Open drawer*/}
        {/*</label>*/}
        <App />
        {/* Page content here */}
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <div className="menu p-4 w-80 min-h-full h-fit bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <div className="flex flex-col justify-start items-center">
            <div className="flex flex-col justify-start items-center w-5/6">
              <div className="flex flex-row justify-between m-1 w-full">
                <button
                  className="btn btn-sm btn-info m-1"
                  onClick={() => {
                    setRefetchRequested(true);
                    refetchRooms();
                  }}
                >
                  Get all
                </button>
                <ThemeSelector />
              </div>
              <div
                data-tip="Jellyfish server token"
                className="form-control m-1 flex flex-row items-center tooltip tooltip-info tooltip-right w-full"
              >
                <input
                  type="text"
                  placeholder="Jellyfish server token"
                  className="input input-bordered w-full max-w-xs"
                  value={serverToken || ""}
                  onChange={(event) => {
                    setServerToken(event.target.value);
                  }}
                />
              </div>
              <div
                data-tip="Signaling protocol"
                className="form-control m-1 flex tooltip tooltip-info tooltip-right flex-row items-center w-full"
              >
                <input
                  type="text"
                  placeholder="Protocol"
                  className="input input-bordered w-full max-w-xs"
                  value={signalingProtocol || ""}
                  onChange={(event) => {
                    setSignalingProtocol(event.target.value);
                  }}
                />
              </div>
              <div
                data-tip="Jellyfish server"
                className="form-control m-1 tooltip tooltip-info tooltip-right flex flex-row items-center w-full"
              >
                <input
                  type="text"
                  placeholder="Jellyfish host"
                  className="input input-bordered w-full max-w-xs"
                  value={signalingHost || ""}
                  onChange={(event) => {
                    setSignalingHost(event.target.value);
                  }}
                />
              </div>

              <div
                data-tip="Signaling path"
                className="form-control tooltip tooltip-info tooltip-right m-1 flex flex-row items-center w-full"
              >
                <input
                  type="text"
                  placeholder="Signaling path"
                  className="input input-bordered w-full max-w-xs"
                  value={signalingPath || ""}
                  onChange={(event) => {
                    setSignalingPath(event.target.value);
                  }}
                />
              </div>
              <button
                className="btn btn-sm btn-accent m-1"
                onClick={() => {
                  setServerToken(DEFAULT_TOKEN);
                  setSignalingHost(DEFAULT_HOST);
                  setSignalingPath(DEFAULT_PATH);
                  setSignalingProtocol(DEFAULT_PROTOCOL);
                }}
              >
                Restore default
              </button>
            </div>
            <div className="flex justify-items-start w-5/6 flex-row">
              <div className="w-1/2">
                <PersistentExtras name={HLS_DISPLAY} />
              </div>
              <div className="w-1/2">
                <PersistentExtras name={SERVER_STATE} />
              </div>
            </div>
            <div className="flex justify-items-start w-5/6 flex-row">
              <div className="w-1/2">
                <PersistentInput name={REFETCH_ON_SUCCESS} />
              </div>
              <div className="w-1/2">
                <PersistentInput name={REFETCH_ON_MOUNT} />
              </div>
            </div>

            <div className="flex w-full justify-evenly flex-row"></div>
            <LogSelector />
          </div>
        </div>
      </div>
    </div>
  );
};
