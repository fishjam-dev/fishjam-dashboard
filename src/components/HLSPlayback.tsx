import { useCallback, useRef, useState } from "react";
import Hls from "hls.js";
import { useServerSdk } from "./ServerSdkContext";
import { CopyLinkButton } from "./CopyButton";

export default function HlsPlayback({ roomId }: { roomId: string }) {
  const { signalingHost } = useServerSdk();
  const hls = useRef<Hls | null>(null);
  const hlsLink = `http://${signalingHost}/hls/${roomId}/index.m3u8`;
  const [src, setSrc] = useState(hlsLink);
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
    <div className="w-full pt-2 flex flex-col gap-2">
      <video controls ref={loadUrl} autoPlay muted className="w-full" />
      <div className="flex flex-row gap-2">
        <button
          className="btn btn-sm btn-success"
          onClick={() => {
            setSrc(hlsLink);
            console.log(hlsLink);
          }}
        >
          Update source
        </button>
        <h3 className="mt-1">Copy HLS source</h3>
        <CopyLinkButton url={src} />
      </div>
    </div>
  );
}
