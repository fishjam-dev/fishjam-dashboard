import React, { useContext, useMemo } from "react";
import { Component as ComponentApi, RoomApi } from "../server-sdk";
import axios from "axios";
import { ServerMessage } from "../protos/jellyfish/server_notifications";
import { showToastError } from "./Toasts";

export type ServerSdkType = {
  signalingHost: string | null;
  signalingProtocol: string | null;
  signalingPath: string | null;

  roomApi: RoomApi | null;
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
  const serverWebsocket = useMemo(() => (httpServerUrl ? createWS(httpServerUrl) : null), [httpServerUrl]);
  if (serverWebsocket) {
    serverWebsocket.binaryType = "arraybuffer";
    // create a new writer
    const auth = ServerMessage.encode({ authRequest: { token: "development" } }).finish();
    const subscr = ServerMessage.encode({ subscribeRequest: { eventType: 1 } }).finish();

    serverWebsocket?.addEventListener("open", () => {
      serverWebsocket.send(auth);
      serverWebsocket.send(subscr);
    });
  }
  const roomApi = useMemo(() => (httpApiUrl ? new RoomApi(undefined, httpApiUrl, client) : null), [client, httpApiUrl]);

  return (
    <ServerSdkContext.Provider
      value={{
        roomApi,
        serverWebsocket,
        serverToken,
        signalingProtocol,
        signalingHost,
        signalingPath,
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
