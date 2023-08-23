import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ComponentApi, PeerApi, RoomApi } from "../server-sdk";
import axios from "axios";
import { useLocalStorageStateString } from "./LogSelector";
import { LOCAL_STORAGE_HOST_KEY, LOCAL_STORAGE_PATH_KEY, LOCAL_STORAGE_PROTOCOL_KEY } from "../containers/App";

export type ServerSdkType = {
  setSignalingHost: (value: string) => void;
  signalingHost: string | null;

  setSignalingProtocol: (value: string) => void;
  signalingProtocol: string | null;

  setSignalingPath: (value: string) => void;
  signalingPath: string | null;

  // todo refactor
  serverMessagesWebsocket: string | null;
  roomApi: RoomApi | null;
  peerApi: PeerApi | null;
  componentApi: ComponentApi | null;

  serverToken: string | null;
  setServerToken: (value: string | null) => void;
};

const ServerSdkContext = React.createContext<ServerSdkType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  currentHost: string;
  currentProtocol: string;
  currentPath: string;
  currentServerToken: string;
};

export const ServerSDKProvider = ({
  children,
  currentHost,
  currentPath,
  currentProtocol,
  currentServerToken,
}: Props) => {
  const [host, setHost] = useLocalStorageStateString(`${currentHost}`, currentHost);
  const [protocol, setProtocol] = useLocalStorageStateString(`${currentHost}-protocol`, currentProtocol); // `ws` or `wss
  const [path, setPath] = useLocalStorageStateString(`${currentHost}-path`, currentPath);
  const [serverMessagesWebsocket, _] = useState<string | null>(null);

  const [httpApiUrl, setHttpApiUrl] = useState<string | null>(null);

  const [serverToken, setServerToken] = useLocalStorageStateString(`${currentHost}-serverToken`, currentServerToken); // `ws` or `wss

  const setHostInput = useCallback(
    (value: string) => {
      setHost(value);
      localStorage.setItem(LOCAL_STORAGE_HOST_KEY, value);
    },
    [setHost],
  );

  const setProtocolInput = useCallback(
    (value: string) => {
      setProtocol(value);
      localStorage.setItem(LOCAL_STORAGE_PROTOCOL_KEY, value);
    },
    [setProtocol],
  );

  const setPathInput = useCallback(
    (value: string) => {
      setPath(value);
      localStorage.setItem(LOCAL_STORAGE_PATH_KEY, value);
    },
    [setPath],
  );

  useEffect(() => {
    const restProtocol = protocol === "wss" ? "https" : "http";

    const abc = `${restProtocol}://${host}`;
    setHttpApiUrl(abc);
  }, [host, protocol]);

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
        setServerToken,

        setSignalingProtocol: setProtocolInput,
        signalingProtocol: protocol,

        setSignalingHost: setHostInput,
        signalingHost: host,

        setSignalingPath: setPathInput,
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
