import { JellyfishClient } from "@jellyfish-dev/react-client-sdk";
import { useEffect } from "react";
import { settingsSelectorAtom } from "./LogSelector";
import { useAtom } from "jotai";

const onJoinErrorAtom = settingsSelectorAtom("onJoinError");
const onJoinSuccessAtom = settingsSelectorAtom("onJoinSuccess");
const onPeerJoinedAtom = settingsSelectorAtom("onPeerJoined");
const onPeerUpdatedAtom = settingsSelectorAtom("onPeerUpdated");
const onPeerLeftAtom = settingsSelectorAtom("onPeerLeft");
const onTrackReadyAtom = settingsSelectorAtom("onTrackReady");
const onTrackAddedAtom = settingsSelectorAtom("onTrackAdded");
const onTrackRemovedAtom = settingsSelectorAtom("onTrackRemoved");
const onTrackUpdatedAtom = settingsSelectorAtom("onTrackUpdated");
const onBandwidthEstimationChangedAtom = settingsSelectorAtom("onBandwidthEstimationChanged");
const onTracksPriorityChangedAtom = settingsSelectorAtom("onTracksPriorityChanged");
const onEncodingChangedAtom = settingsSelectorAtom("onEncodingChanged");
const onVoiceActivityChangedAtom = settingsSelectorAtom("onVoiceActivityChanged");

// TODO: refactor this
export const useLogging = <P, T>(client: JellyfishClient<P, T> | null) => {
  const [onJoinErrorLog] = useAtom(onJoinErrorAtom);
  const [onJoinSuccessLog] = useAtom(onJoinSuccessAtom);
  const [onPeerJoinedLog] = useAtom(onPeerJoinedAtom);
  const [onPeerUpdatedLog] = useAtom(onPeerUpdatedAtom);
  const [onPeerLeftLog] = useAtom(onPeerLeftAtom);
  const [onTrackReadyLog] = useAtom(onTrackReadyAtom);
  const [onTrackAddedLog] = useAtom(onTrackAddedAtom);
  const [onTrackRemovedLog] = useAtom(onTrackRemovedAtom);
  const [onTrackUpdatedLog] = useAtom(onTrackUpdatedAtom);
  const [onBandwidthEstimationChangedLog] = useAtom(onBandwidthEstimationChangedAtom);
  const [onTracksPriorityChangedLog] = useAtom(onTracksPriorityChangedAtom);
  const [onEncodingChangedLog] = useAtom(onEncodingChangedAtom);
  const [onVoiceActivityChangedLog] = useAtom(onVoiceActivityChangedAtom);

  useEffect(() => {
    if (!client) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onJoinSuccess = (peerId: any, peersInRoom: any) => {
      if (onJoinSuccessLog) {
        console.log({ name: "onJoinSuccess", peerId, peersInRoom });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onJoinError = (metadata: any) => {
      if (onJoinErrorLog) {
        console.log({ name: "onJoinError", metadata });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onPeerJoined = (peer: any) => {
      if (onPeerJoinedLog) {
        console.log({ name: "onPeerJoined", peer });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onPeerUpdated = (peer: any) => {
      if (onPeerUpdatedLog) {
        console.log({ name: "onPeerUpdated", peer });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onPeerLeft = (peer: any) => {
      if (onPeerLeftLog) {
        console.log({ name: "onPeerLeft", peer });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTrackReady = (ctx: any) => {
      if (onTrackReadyLog) {
        console.log({ name: "onTrackReady", ctx });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTrackAdded = (ctx: any) => {
      if (onTrackAddedLog) {
        console.log({ name: "onTrackAdded", ctx });
      }

      // todo remove this callback in useEffect return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx.on("onEncodingChanged", (context: any) => {
        if (onEncodingChangedLog) {
          console.log({ name: "onEncodingChanged", context });
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx.on("onVoiceActivityChanged", (context: any) => {
        if (onVoiceActivityChangedLog) {
          console.log({ name: "onVoiceActivityChanged", context });
        }
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTrackRemoved = (ctx: any) => {
      if (onTrackRemovedLog) {
        console.log({ name: "onTrackRemoved", ctx });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTrackUpdated = (ctx: any) => {
      if (onTrackUpdatedLog) {
        console.log({ name: "onTrackUpdated", ctx });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onBandwidthEstimationChanged = (estimation: any) => {
      if (onBandwidthEstimationChangedLog) {
        console.log({ name: "onBandwidthEstimationChanged", estimation });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTracksPriorityChanged = (enabledTracks: any, disabledTracks: any) => {
      if (onTracksPriorityChangedLog) {
        console.log({
          name: "onTracksPriorityChanged",
          enabledTracks,
          disabledTracks,
        });
      }
    };

    const onAuthError = () => {
      console.log("onAuthError");
    };

    const onConnectionError = (_message: string) => {
      console.log("onConnectionError");
    };

    const onSocketError = () => {
      console.log("onSocketError");
    };

    client.on("joined", onJoinSuccess);
    client.on("joinError", onJoinError);
    // client.on("onRemoved", onJoinRemove);
    client.on("peerJoined", onPeerJoined);
    client.on("peerUpdated", onPeerUpdated);
    client.on("peerLeft", onPeerLeft);
    client.on("trackReady", onTrackReady);
    client.on("trackAdded", onTrackAdded);
    client.on("trackRemoved", onTrackRemoved);
    client.on("trackUpdated", onTrackUpdated);
    client.on("bandwidthEstimationChanged", onBandwidthEstimationChanged);
    client.on("tracksPriorityChanged", onTracksPriorityChanged);

    client.on("authError", onAuthError);
    client.on("connectionError", onConnectionError);
    client.on("socketError", onSocketError);

    return () => {
      client.off("joined", onJoinSuccess);
      client.off("joinError", onJoinError);
      // client.off("onRemoved", onJoinRemove);
      client.off("peerJoined", onPeerJoined);
      client.off("peerUpdated", onPeerUpdated);
      client.off("peerLeft", onPeerLeft);
      client.off("trackReady", onTrackReady);
      client.off("trackAdded", onTrackAdded);
      client.off("trackRemoved", onTrackRemoved);
      client.off("trackUpdated", onTrackUpdated);
      client.off("bandwidthEstimationChanged", onBandwidthEstimationChanged);
      client.off("tracksPriorityChanged", onTracksPriorityChanged);

      client.off("authError", onAuthError);
      client.off("connectionError", onConnectionError);
      client.off("socketError", onSocketError);
    };
  }, [
    client,
    onBandwidthEstimationChangedLog,
    onEncodingChangedLog,
    onJoinErrorLog,
    onJoinSuccessLog,
    onPeerJoinedLog,
    onPeerLeftLog,
    onPeerUpdatedLog,
    onTrackAddedLog,
    onTrackReadyLog,
    onTrackRemovedLog,
    onTrackUpdatedLog,
    onTracksPriorityChangedLog,
    onVoiceActivityChangedLog,
  ]);
};
