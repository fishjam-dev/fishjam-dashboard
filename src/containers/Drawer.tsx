import App2, { REFETCH_ON_MOUNT, REFETCH_ON_SUCCESS } from "./App2";
import { PersistentInput } from "../components/LogSelector";
import { useServerSdk } from "../components/ServerSdkContext";
import { useApi } from "./Api";
import { ThemeSelector } from "../components/ThemeSelector";

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

  return (
    <div className="drawer drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/*<label htmlFor="my-drawer" className="btn btn-primary drawer-button">*/}
        {/*  Open drawer*/}
        {/*</label>*/}
        <App2 />
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <div className="menu p-4 w-80 h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <div className="flex flex-col justify-start items-center">
            <ThemeSelector />
            <button
              className="btn btn-sm btn-info m-1"
              onClick={() => {
                refetchRooms();
              }}
            >
              Get all
            </button>
            <div className="form-control m-1 flex flex-row items-center">
              <input
                type="text"
                placeholder="Server token"
                className="input input-bordered w-full max-w-xs"
                value={serverToken || ""}
                onChange={(event) => {
                  setServerToken(event.target.value);
                }}
              />
              <div className="tooltip tooltip-bottom w-[32px] h-full m-2" data-tip="Jellyfish server token">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="form-control m-1 flex flex-row items-center">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                value={signalingProtocol || ""}
                onChange={(event) => {
                  setSignalingProtocol(event.target.value);
                }}
              />
              <div className="tooltip tooltip-bottom w-[32px] h-full m-2" data-tip="Protocol">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="form-control m-1 flex flex-row items-center">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                value={signalingHost || ""}
                onChange={(event) => {
                  setSignalingHost(event.target.value);
                }}
              />
              <div className="tooltip tooltip-bottom w-[32px] h-full m-2" data-tip="Jellyfish host">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="form-control m-1 flex flex-row items-center">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                value={signalingPath || ""}
                onChange={(event) => {
                  setSignalingPath(event.target.value);
                }}
              />
              <div className="tooltip tooltip-bottom w-[32px] h-full m-2" data-tip="Signaling path">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="flex flex-row">
              <PersistentInput name={REFETCH_ON_MOUNT} />
              <PersistentInput name={REFETCH_ON_SUCCESS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
