import { useCallback, useRef, useState } from "react";
import Hls from "hls.js";
import { useServerSdk } from "./ServerSdkContext";
import { useStore } from "../containers/RoomsContext";
const BIG_BUCK_BUNNY_SRC = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export default function HlsPlayback({ roomId }: { roomId: string }) {
  const { signalingHost } = useServerSdk();
  const hls = useRef<Hls | null>(null);
  const [src, setSrc] = useState(BIG_BUCK_BUNNY_SRC);
  const { state } = useStore();

  const hlsLink = `http://${signalingHost}/hls/${roomId}/index.m3u8`;
  const loadUrl = useCallback(
    (media: HTMLVideoElement | null) => {
      hls.current?.destroy();
      if (!media) return;
      hls.current = new Hls();
      hls.current.loadSource(src);
      hls.current.attachMedia(media);
    },
    [src],
  );

  return (
    <div className="w-full pt-2">
      <video controls ref={loadUrl} autoPlay muted className="w-full" />
      <button
        onClick={() => {
          setSrc(hlsLink);
          console.log(hlsLink);
          console.log(Object.values(state.rooms).find((room) => room.id === state.selectedRoom)?.roomStatus.components);
        }}
      >
        change source
      </button>
    </div>
  );
}
