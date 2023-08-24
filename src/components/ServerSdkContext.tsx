import React, { useContext, useEffect, useMemo, useState } from "react";
import { ComponentApi, PeerApi, RoomApi } from "../server-sdk";
import axios from "axios";
import { useLocalStorageStateString } from "./LogSelector";

export type ServerSdkType = {
  signalingHost: string | null;
  signalingProtocol: string | null;
  signalingPath: string | null;

  // todo refactor
  serverMessagesWebsocket: string | null;

  roomApi: RoomApi | null;
  peerApi: PeerApi | null;
  componentApi: ComponentApi | null;

  serverToken: string | null;
};

const ServerSdkContext = React.createContext<ServerSdkType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  currentHost: string;
  currentSignalingProtocol: "wss" | "ws";
  currentHttpProtocol: "https" | "http";
  currentPath: string;
  currentServerToken: string;
};

export const ServerSDKProvider = ({
  children,
  currentHost,
  currentPath,
  currentSignalingProtocol,
  currentServerToken,
  currentHttpProtocol,
}: Props) => {
  const [host, setHost] = useLocalStorageStateString(`${currentHost}`, currentHost);
  const [protocol, setProtocol] = useLocalStorageStateString(`${currentHost}-protocol`, currentSignalingProtocol); // `ws` or `wss
  const [apiProtocol] = useLocalStorageStateString(`${currentHost}-api-protocol`, currentHttpProtocol); // `http` or `https`
  const [path, setPath] = useLocalStorageStateString(`${currentHost}-path`, currentPath);
  const [serverMessagesWebsocket, _] = useState<string | null>(null);

  const [httpApiUrl, setHttpApiUrl] = useState<string | null>(null);

  const [serverToken, setServerToken] = useLocalStorageStateString(`${currentHost}-serverToken`, currentServerToken);

  useEffect(() => {
    setHttpApiUrl(`${apiProtocol}://${host}`);
  }, [host, apiProtocol]);

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

        signalingProtocol: protocol,
        signalingHost: host,
        signalingPath: path,

        serverMessagesWebsocket,
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
