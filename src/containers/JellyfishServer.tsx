import App from "./App";
import { ServerSDKProvider } from "../components/ServerSdkContext";
import { RoomsContextProvider } from "./RoomsContext";
import { ApiProvider } from "./Api";

export type ServerProps = {
  host: string;
  protocol: string;
  path: string;
  serverToken: string;
  refetchDemand: boolean;
  active: boolean;
};

export const JellyfishServer = ({ host, protocol, path, serverToken, refetchDemand, active }: ServerProps) => {
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
            <App host={host} refetchDemand={refetchDemand} active={active} />{" "}
            {/* TODO: remove active, not needed with other PR*/}
          </div>
        </ApiProvider>
      </RoomsContextProvider>
    </ServerSDKProvider>
  );
};
