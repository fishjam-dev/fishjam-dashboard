import { useCallback, useRef, useState } from "react";
import Hls from "hls.js";
import { useServerSdk } from "./ServerSdkContext";
import { CopyLinkButton } from "./CopyButton";

export default function HlsPlayback({ roomId, isPlayable }: { roomId: string; isPlayable: boolean }) {
  const { signalingHost, currentHttpProtocol } = useServerSdk();
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  const hls = useRef<Hls | null>(null);
  const hlsLink = `${currentHttpProtocol}://${signalingHost}/hls/${roomId}/index.m3u8`;
  const loadUrl = useCallback(
    (media: HTMLVideoElement | null) => {
      hls.current?.destroy();
      if (!media) return;
      hls.current = new Hls();
      hls.current.loadSource(hlsLink);
      hls.current.attachMedia(media);
    },
    [hlsLink],
  );

  return (
    <div className="w-full pt-2 flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <h3>Play HLS when ready</h3>
        <input type="checkbox" className="toggle" checked={autoPlay} onChange={() => setAutoPlay(!autoPlay)} />
        <h3>Copy HLS source:</h3>
        <CopyLinkButton url={hlsLink} />
      </div>
      {isPlayable && autoPlay && <video controls ref={loadUrl} autoPlay muted className="w-full" />}
    </div>
  );
}
