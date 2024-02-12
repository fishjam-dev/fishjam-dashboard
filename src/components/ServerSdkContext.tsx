import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { HlsApi, RoomApi } from "../server-sdk";
import axios from "axios";
import { ServerMessage } from "../protos/jellyfish/server_notifications";
import { showToastError } from "./Toasts";

export type ServerSdkType = {
  signalingHost: string | null;
  signalingProtocol: string | null;
  signalingPath: string | null;
  currentHttpProtocol: string | null;
  roomApi: RoomApi | null;
  hlsApi: HlsApi | null;
  httpApiUrl: string | null;
  serverWebsocket: WebSocket | null;
  serverToken: string | null;
};

const ServerSdkContext = React.createContext<ServerSdkType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  signalingHost: string;
  signalingProtocol: "wss" | "ws";
  currentHttpProtocol: "https" | "http";
  signalingPath: string;
  serverToken: string;
};

const createWS = (url: string) => {
  try {
    return new WebSocket(url);
  } catch (e) {
    console.error(e);
    showToastError("Error while connecting to server websocket, consider changing to secure connection.");
    return null;
  }
};

export const ServerSDKProvider = ({
  children,
  signalingHost,
  signalingPath,
  signalingProtocol,
  serverToken,
  currentHttpProtocol,
}: Props) => {
  const httpApiUrl = `${currentHttpProtocol}://${signalingHost}`;

  const client = useMemo(
    () =>
      axios.create({
        headers: {
          Authorization: `Bearer ${serverToken}`,
        },
      }),
    [serverToken],
  );
  const httpServerUrl = signalingProtocol + "://" + signalingHost + signalingPath.replace("peer", "server");

  const [serverWebsocket, setServerWebsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = createWS(httpServerUrl)

    if (!websocket) return () => {};

    websocket.binaryType = "arraybuffer";
    // create a new writer
    const auth = ServerMessage.encode({ authRequest: { token: serverToken } }).finish();
    const subscr = ServerMessage.encode({ subscribeRequest: { eventType: 1 } }).finish();

    websocket?.addEventListener("open", () => {
      websocket.send(auth);
      websocket.send(subscr);
    });

    setServerWebsocket(websocket);

    return () => {
      websocket.close()
      setServerWebsocket(null);
    };
  }, [httpServerUrl, serverToken]);

  const roomApi = useMemo(() => (httpApiUrl ? new RoomApi(undefined, httpApiUrl, client) : null), [client, httpApiUrl]);
  const hlsApi = useMemo(() => (httpApiUrl ? new HlsApi(undefined, httpApiUrl, client) : null), [client, httpApiUrl]);

  return (
    <ServerSdkContext.Provider
      value={{
        httpApiUrl,
        roomApi,
        hlsApi,
        serverWebsocket,
        serverToken,
        signalingProtocol,
        signalingHost,
        signalingPath,
        currentHttpProtocol,
      }}
    >
      {children}
    </ServerSdkContext.Provider>
  );
};

export const useServerSdk = (): ServerSdkType => {
  const context = useContext(ServerSdkContext);
  if (!context) throw new Error("useServerAddress must be used within a DeveloperInfoProvider");
  return context;
};
