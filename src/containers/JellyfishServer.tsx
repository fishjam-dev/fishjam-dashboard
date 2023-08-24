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
};

export const JellyfishServer = ({ host, isWss, path, serverToken, refetchDemand, active, isHttps }: ServerProps) => {
  return (
    <ServerSDKProvider
      currentHost={host}
      currentPath={path}
      currentSignalingProtocol={isWss ? "wss" : "ws"}
      currentHttpProtocol={isHttps ? "https" : "http"}
      currentServerToken={serverToken}
    >
      <RoomsContextProvider>
        <ApiProvider>
          <div className="flex flex-col">
            <JellyfishInstance host={host} refetchDemand={refetchDemand} active={active} />
          </div>
        </ApiProvider>
      </RoomsContextProvider>
    </ServerSDKProvider>
  );
};
