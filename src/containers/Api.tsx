import { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from "react";
import { useStore } from "./RoomsContext";
import { useServerSdk } from "../components/ServerSdkContext";
import { showToastError } from "../components/Toasts";
import { getBooleanValue } from "../utils/localStorageUtils";
import { REFETCH_ON_MOUNT, REFETCH_ON_SUCCESS } from "./JellyfishInstance";

export type ApiContext = {
  refetchRoomsIfNeeded: () => void;
  refetchRooms: () => void;
};

const ApiContext = createContext<ApiContext | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const ApiProvider = ({ children }: Props) => {
  const { dispatch } = useStore();
  const { roomApi, httpApiUrl } = useServerSdk();

  const refetchRooms = useCallback(() => {
    roomApi
      ?.getAllRooms()
      .then((response) => {
        dispatch({ type: "UPDATE_ROOMS", rooms: response.data.data });
      })
      .catch(() => {
        console.error({ refetch: "Error" });

        showToastError(`Cannot connect to Jellyfish server: ${httpApiUrl}`, {
          id: `CANNOT-CONNECT-TO-JELLYFISH-${httpApiUrl}`,
        });
        dispatch({ type: "REMOVE_ROOMS" });
      });
  }, [dispatch, roomApi]);

  const refetchRoomsIfNeeded = () => {
    if (getBooleanValue(REFETCH_ON_SUCCESS)) {
      refetchRooms();
    }
  };

  const ref = useRef<boolean>(false);
  useEffect(() => {
    if (roomApi === null || ref.current) return;

    if (getBooleanValue(REFETCH_ON_MOUNT)) {
      refetchRooms();
    }
    ref.current = true;
  }, [refetchRooms, roomApi]);

  return <ApiContext.Provider value={{ refetchRooms, refetchRoomsIfNeeded }}>{children}</ApiContext.Provider>;
};

export const useApi = (): ApiContext => {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useRoomsContext must be used within a RoomsContextProvider");
  return context;
};
