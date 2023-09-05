import { useCallback, useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import { serversAtom, roomIdsAtom } from "../containers/App";
import { useAtom } from "jotai";
const BIG_BUCK_BUNNY_SRC = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export default function HlsPlayback() {
  const hls = useRef<Hls | null>(null);
  const [src, setSrc] = useState(BIG_BUCK_BUNNY_SRC);
  const [servers, _] = useAtom(serversAtom);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomIds] = useAtom(roomIdsAtom(selectedServer || ""));

  const createHlsLink = (selectedServer: string, selectedRoom: string) => {
    return `http://${selectedServer}/hls/${selectedRoom}/index.m3u8`;
  };
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

  useEffect(() => {
    if (!selectedServer) return;
    setRooms(roomIds);
  }, [roomIds, selectedServer]);

  return (
    <div className="w-[600px]">
      <video controls ref={loadUrl} autoPlay muted className="w-full" />
      <div className="flex mt-2 w-full gap-2">
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={(event) => setSelectedServer(event.target.value)}
          defaultValue={"default"}
        >
          <option disabled value={"default"}>
            Select a server
          </option>
          {Object.values(servers).map((server) => (
            <option key={server.host} value={server.host}>
              {server.host}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={(event) => setSelectedRoom(event.target.value)}
          defaultValue={"default"}
        >
          <option disabled value={"default"}>
            Select a room
          </option>
          {rooms.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSrc(createHlsLink(selectedServer || "", selectedRoom || ""))}
          className="btn btn-success ml-1"
          disabled={!selectedServer || !selectedRoom}
        >
          Update HLS source
        </button>
      </div>
    </div>
  );
}
