import { useCallback, useRef } from "react";
import Hls from "hls.js";
import { useServerSdk } from "./ServerSdkContext";
import { CopyLinkButton } from "./CopyButton";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

const autoPlayHlsAtom = atomWithStorage("hls-auto-play", true);

export default function HlsPlayback({ roomId, isPlayable }: { roomId: string; isPlayable: boolean }) {
  const { signalingHost, currentHttpProtocol } = useServerSdk();
  const [autoPlay, setAutoPlay] = useAtom(autoPlayHlsAtom);
  const hls = useRef<Hls | null>(null);

  const hlsLink = `${currentHttpProtocol}://${signalingHost}/hls/${roomId}/index.m3u8`;

  const loadUrl = useCallback(
    (media: HTMLVideoElement | null) => {
      hls.current?.destroy();
      if (!media) return;
      hls.current = new Hls({
        playlistLoadPolicy: {
          default: {
            maxTimeToFirstByteMs: 10000,
            maxLoadTimeMs: 20000,
            timeoutRetry: {
              maxNumRetry: 2,
              retryDelayMs: 0,
              maxRetryDelayMs: 0,
            },
            errorRetry: {
              backoff: "linear",
              maxNumRetry: 100,
              retryDelayMs: 1000,
              maxRetryDelayMs: 20000,
            },
          },
        },
      });

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
      </div>
      <button
        onClick={() => {
          const hlsClient = hls.current;
          if (!hlsClient) return;

          hlsClient.loadSource(hlsLink);
        }}
      >
        Refetch
      </button>

      <button
        onClick={() => {
          const hlsClient = hls.current;
          if (!hlsClient) return;

          console.log({ hlsClient });
        }}
      >
        Log state
      </button>

      <div className="flex flex-row gap-2">
        <h3>Copy HLS source:</h3>
        <CopyLinkButton url={hlsLink} />
      </div>
      {isPlayable && <video controls ref={loadUrl} autoPlay={autoPlay} muted className="w-full" />}
    </div>
  );
}
