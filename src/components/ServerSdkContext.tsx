import React, { useContext, useMemo } from "react";
import { ComponentApi, PeerApi, RoomApi } from "../server-sdk";
import axios from "axios";

export type ServerSdkType = {
  signalingHost: string | null;
  signalingProtocol: string | null;
  signalingPath: string | null;

  roomApi: RoomApi | null;
  peerApi: PeerApi | null;
  componentApi: ComponentApi | null;

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

  const roomApi = useMemo(() => (httpApiUrl ? new RoomApi(undefined, httpApiUrl, client) : null), [client, httpApiUrl]);
  const peerApi = useMemo(() => (httpApiUrl ? new PeerApi(undefined, httpApiUrl, client) : null), [client, httpApiUrl]);
  const componentApi = useMemo(
    () => (httpApiUrl ? new ComponentApi(undefined, httpApiUrl, client) : null),
    [client, httpApiUrl],
  );

  return (
    <ServerSdkContext.Provider
      value={{
        roomApi,
        peerApi,
        componentApi,
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
