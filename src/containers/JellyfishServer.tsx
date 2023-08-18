import App2 from "./App";
import { ServerSDKProvider } from "../components/ServerSdkContext";
import { RoomsContextProvider } from "./RoomsContext";
import { ApiProvider } from "./Api";

export type ServerProps = {
  host: string;
  protocol: string;
  path: string;
  serverToken: string;
  refetchDemand: boolean;
};

export const JellyfishServer = ({ host, protocol, path, serverToken, refetchDemand }: ServerProps) => {
  return (
    <ServerSDKProvider
      currentHost={host}
      currentPath={path}
      currentProtocol={protocol}
      currentServerToken={serverToken}
    >
      <RoomsContextProvider>
        <ApiProvider>
          <div className="flex flex-col">
            <App2 host={host} refetchDemand={refetchDemand} />
          </div>
        </ApiProvider>
      </RoomsContextProvider>
    </ServerSDKProvider>
  );
};
