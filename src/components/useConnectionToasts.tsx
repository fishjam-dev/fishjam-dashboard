import { Client } from "@jellyfish-dev/react-client-sdk";

import { useEffect } from "react";
import { showToastError } from "./Toasts";

export const useConnectionToasts = <P, T>(client: Client<P, T> | null) => {
  useEffect(() => {
    if (!client) return;

    const onSocketError = () => {
      showToastError("Socket error occurred");
    };

    const onConnectionError = (message: string) => {
      showToastError(`Connection error occurred. ${message ?? ""}`);
    };

    const onJoinError = () => {
      showToastError("Failed to join the room");
    };

    const onAuthError = (error: string) => {
      showToastError(`Failed to authenticate: ${error}`);
    };

    client.on("socketError", onSocketError);
    client.on("connectionError", onConnectionError);
    client.on("joinError", onJoinError);
    client.on("authError", onAuthError);

    return () => {
      client.off("socketError", onSocketError);
      client.off("connectionError", onConnectionError);
      client.off("joinError", onJoinError);
      client.off("authError", onAuthError);
    };
  }, [client]);
};
