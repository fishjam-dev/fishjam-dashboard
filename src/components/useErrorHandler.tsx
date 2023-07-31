import { JellyfishClient } from "@jellyfish-dev/react-client-sdk";
import { useEffect } from "react";
import { getBooleanValue } from "../utils/localStorageUtils";
import { showToastError } from "./Toasts";

export const useErrorHandler = <P, T>(client: JellyfishClient<P, T> | null) => {
  useEffect(() => {
    if (!client) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onPeerLeft = (peer: any) => {
      if (getBooleanValue("onPeerLeft")) {
        showToastError("client was disconnected from server");
      }
    };
    client.on("peerLeft", onPeerLeft);
    return () => {
      client.off("peerLeft", onPeerLeft);
    };
  });
};
