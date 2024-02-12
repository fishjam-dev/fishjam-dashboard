import JellyfishInstance from "./JellyfishInstance";
import { ServerSDKProvider } from "../components/ServerSdkContext";
import { RoomsContextProvider } from "./RoomsContext";
import { ApiProvider } from "./Api";

export type ServerProps = {
  host: string;
  isWss: boolean;
  isHttps: boolean;
  path: string;
  serverToken: string;
  refetchDemand: boolean;
  active: boolean;
  id: string;
};

export const JellyfishServer = ({ host, isWss, path, serverToken, refetchDemand, active, isHttps }: ServerProps) => {
  return (
    <ServerSDKProvider
      signalingHost={host}
      signalingPath={path}
      signalingURISchema={isWss ? "wss" : "ws"}
      currentURISchema={isHttps ? "https" : "http"}
      serverToken={serverToken}
    >
      <RoomsContextProvider>
        <ApiProvider>
          <JellyfishInstance host={host} refetchDemand={refetchDemand} active={active} />
        </ApiProvider>
      </RoomsContextProvider>
    </ServerSDKProvider>
  );
};
