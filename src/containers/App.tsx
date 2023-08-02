import React, { useCallback, useState } from "react";
import { LogSelector, PersistentInput, useLocalStorageState } from "../components/LogSelector";
import { Room } from "./Room";
import { JsonComponent } from "../components/JsonComponent";
import { ThemeSelector } from "../components/ThemeSelector";
import type { StreamInfo } from "../components/StreamingDeviceSelector";
import { Room as RoomAPI } from "../server-sdk";
import { useServerSdk } from "../components/ServerSdkContext";
import { showToastError } from "../components/Toasts";
import { getBooleanValue } from "../utils/localStorageUtils";
import { VideoroomConnect } from "../components/VideoroomConnect";

export const REFETCH_ON_SUCCESS = "refetch on success";
export const REFETCH_ON_MOUNT = "refetch on mount";

export const App = () => {
  const [room, setRoom] = useState<RoomAPI[] | null>(null);
  const [showServerState, setShow] = useLocalStorageState(`show-json-fullstate`);
  const [showLogSelector, setShowLogSelector] = useLocalStorageState("showServerState-log-selector");
  const [showVideoroom, setShowVideoroom] = useLocalStorageState("showVideoroom-log-selector");
  const [showDeviceSelector, setShowDeviceSelector] = useLocalStorageState("showDeviceSelector");
  const [showServerEvents, setShowServerEvents] = useLocalStorageState("showServerEvents");
  const [serverEventsState, setServerEventsState] = useState<"connected" | "disconnected">("disconnected");
  const [selectedVideoStream] = useState<StreamInfo | null>(null);

  const {
    setSignalingProtocol,
    signalingProtocol,
    setSignalingHost,
    signalingHost,
    setSignalingPath,
    signalingPath,
    roomApi,
    serverMessagesWebsocket,
    serverToken,
    setServerToken,
  } = useServerSdk();

  const [serverMessages, setServerMessages] = useState<{ data: unknown; id: string }[]>([]);

  const refetchAll = useCallback(() => {
    roomApi
      ?.jellyfishWebRoomControllerIndex()
      .then((response) => {
        setRoom(response.data.data);
      })
      .catch(() => {
        showToastError("Cannot connect to Jellyfish server");
        setRoom(null);
      });
  }, [roomApi]);

  const refetchIfNeeded = () => {
    if (getBooleanValue(REFETCH_ON_SUCCESS)) {
      refetchAll();
    }
  };

  return (
    <div className="flex flex-col w-full-no-scrollbar h-full box-border">
      <div className="flex flex-row justify-between m-2">
        <div className="flex flex-row justify-start items-center flex-wrap">
          <button
            className="btn btn-sm btn-info m-1"
            onClick={() => {
              refetchAll();
            }}
          >
            Get all
          </button>
          <button
            className="btn btn-sm btn-success m-1"
            onClick={() => {
              roomApi?.jellyfishWebRoomControllerCreate({ maxPeers: 10 }).then(() => {
                refetchIfNeeded();
              });
            }}
          >
            Create room
          </button>
          <button
            className={`btn btn-sm m-1 ${showLogSelector ? "btn-ghost" : ""}`}
            onClick={() => {
              setShowLogSelector(!showLogSelector);
            }}
          >
            {showLogSelector ? "Hide log selector" : "Show log selector"}
          </button>

          <button
            className={`btn btn-sm m-1 ${showServerEvents ? "btn-ghost" : ""}`}
            onClick={() => {
              setShowServerEvents(!showServerEvents);
            }}
          >
            {showServerEvents ? "Hide server events" : "Show server events"}
          </button>

          <button
            className={`btn btn-sm m-1 ${showDeviceSelector ? "btn-ghost" : ""}`}
            onClick={() => {
              setShowDeviceSelector(!showDeviceSelector);
            }}
          >
            {showDeviceSelector ? "Hide device selector" : "Show device selector"}
          </button>

          <button
            className={`btn btn-sm m-1 ${showServerState ? "btn-ghost" : ""}`}
            onClick={() => {
              setShow(!showServerState);
            }}
          >
            {showServerState ? "Hide server room" : "Show server room"}
          </button>

          <button
            className={`btn btn-sm m-1 ${showVideoroom ? "btn-ghost" : ""}`}
            onClick={() => {
              setShowVideoroom(!showVideoroom);
            }}
          >
            {showVideoroom ? "Hide videoroom" : "Show videoroom"}
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

          <div className="flex flex-row w-[150px] m-1">
            <PersistentInput name={REFETCH_ON_SUCCESS} />
          </div>
          <div className="flex flex-row w-[150px] m-1">
            <PersistentInput name={REFETCH_ON_MOUNT} />
          </div>
        </div>
        <div className="flex flex-row justify-start">
          <ThemeSelector />
        </div>
      </div>
      {showServerEvents && (
        <div className="flex m-2 card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-row">
              <span className="card-title">Server events</span>
              <button
                className={`btn btn-sm btn-success m-1`}
                disabled={serverEventsState === "connected"}
                onClick={() => {
                  if (!serverMessagesWebsocket) {
                    showToastError("serverMessagesWebsocket websocket is null");
                    return;
                  }

                  const ws = new WebSocket(serverMessagesWebsocket);
                  const handler = (event: unknown) => {
                    if (event instanceof MessageEvent) {
                      const newData = JSON.parse(event.data);
                      setServerMessages((prevState) => [
                        ...prevState,
                        {
                          data: newData,
                          id: crypto.randomUUID(),
                        },
                      ]);
                    }
                  };
                  ws.addEventListener("message", handler);
                  ws.addEventListener("close", () => {
                    console.warn("close");
                  });
                  ws.addEventListener("error", () => {
                    console.warn("error");
                  });

                  ws.addEventListener("open", () => {
                    console.log("Opened!");
                    setServerEventsState("connected");
                    ws.send(
                      JSON.stringify({
                        type: "controlMessage",
                        data: { type: "authRequest", token: serverToken },
                      }),
                    );
                  });
                }}
              >
                Connect
              </button>
            </div>
            {serverEventsState === "connected" && (
              <div className="mockup-code p-4">
                <small>
                  {serverMessages.map(({ data, id }) => {
                    return (
                      <pre className="!px-0" key={id}>
                        <code>{JSON.stringify(data)}</code>
                      </pre>
                    );
                  })}
                </small>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-row m-2 h-full items-start">
        {showLogSelector && <LogSelector />}
        {showVideoroom && <VideoroomConnect refetchIfNeeded={refetchIfNeeded} />}

        {showServerState && (
          <div>
            <div className="w-[600px] m-2 card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Server state:</h2>
                <JsonComponent state={room} />
              </div>
            </div>
          </div>
        )}
        {room?.map((room) => (
          <Room
            key={room.id}
            roomId={room.id || ""}
            initial={room}
            refetchIfNeeded={refetchIfNeeded}
            selectedVideoStream={selectedVideoStream}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
