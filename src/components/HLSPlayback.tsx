import React, { useCallback, useRef } from "react";
import Hls from "hls.js";
import { useServerSdk } from "./ServerSdkContext";
import { CopyLinkButton } from "./CopyButton";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

const autoPlayHlsAtom = atomWithStorage("hls-auto-play", true);
const showHlsPreviewAtom = atomWithStorage("show-hls-preveiew", true);

export default function HlsPlayback({ roomId, isPlayable }: { roomId: string; isPlayable: boolean }) {
  const { signalingHost, currentURISchema } = useServerSdk();
  const [autoPlay, setAutoPlay] = useAtom(autoPlayHlsAtom);
  const [showHlsPreview, setShowHlsPreview] = useAtom(showHlsPreviewAtom);
  const hls = useRef<Hls | null>(null);

  const hlsLink = `${currentURISchema}://${signalingHost}/hls/${roomId}/index.m3u8`;

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
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-row gap-2 items-center">
          <h3>Show HLS preview</h3>
          <input
            type="checkbox"
            className="toggle"
            checked={showHlsPreview}
            onChange={() => setShowHlsPreview((prev) => !prev)}
          />
        </div>

        <div className="flex flex-row items-center tooltip" data-tip="Auto play">
          <input
            className="checkbox"
            type="checkbox"
            checked={autoPlay}
            onChange={() => setAutoPlay((prev) => !prev)}
          />
        </div>

        <button
          className="btn btn-sm btn-info mx-1 my-0"
          onClick={() => {
            const hlsClient = hls.current;
            if (!hlsClient) return;

            hlsClient.loadSource(hlsLink);
          }}
        >
          Refetch
        </button>

        <div className="flex flex-row gap-2 items-center">
          <h3>Copy HLS source:</h3>
          <CopyLinkButton url={hlsLink} />
        </div>
      </div>
      {showHlsPreview && isPlayable && <video controls ref={loadUrl} autoPlay={autoPlay} muted className="w-full" />}
    </div>
  );
}
