import { useState } from "react";
import { useStore } from "../containers/RoomsContext";
import { DeviceInfo } from "../containers/StreamingSettingsCard";
import AudioVisualizer from "./AudioVisualizer";
import { CloseButton } from "./CloseButton";
import { StreamInfo } from "./StreamingDeviceSelector";
import VideoPlayer from "./VideoPlayer";

type Props = {
  selectedId: DeviceInfo | null;
  setSelectedId: (device: DeviceInfo | null) => void;
  streamInfo: StreamInfo;
  id: string;
};

const getDeviceType = (stream: MediaStream) => {
  if (stream.getVideoTracks().length > 0) {
    return "video";
  } else {
    return "audio";
  }
};

export const DeviceTile = ({ selectedId, setSelectedId, streamInfo, id }: Props) => {
  const { state, dispatch } = useStore();
  const isVideo = streamInfo.stream.getVideoTracks().length > 0;
  const [enabled, setEnabled] = useState<boolean>(true);
  const peer = state.rooms[state.selectedRoom || ""].peers[id];
  const api = peer.client.useSelector((state) => state.connectivity.api);
  const track = peer.tracks[streamInfo.id];
  return (
    <div
      className={`flex flex-col w-40 justify-center rounded-md indicator ${
        selectedId?.id === streamInfo.id ? " border-2 border-green-500 " : " border-2 border-transparent"
      }`}
    >
      <button
        className={`h-fit w-fit `}
        onClick={() => {
          setSelectedId({ id: streamInfo.id, type: getDeviceType(streamInfo.stream), stream: streamInfo.stream });
        }}
      >
        {isVideo ? (
          <div className=" overflow-hidden h-24">
            <VideoPlayer stream={streamInfo.stream} size={"40"} />
          </div>
        ) : (
          <div className="w-fit items-center flex flex-col rounded-md">
            <AudioVisualizer stream={streamInfo.stream} muted={true} size={37} height={90} />
          </div>
        )}
      </button>
      <button
        className={`btn ${enabled ? "btn-error" : "btn-success "} btn-sm m-2`}
        onClick={() => {
          dispatch({
            type: "SET_TRACK_ENABLE",
            roomId: state.selectedRoom || "",
            trackId: track.id,
            peerId: id,
            enable: !enabled,
          });
          setEnabled(!enabled);
        }}
      >
        {enabled ? "Disable" : "Enable"}
      </button>
      <CloseButton
        onClick={() => {
          if (track.serverId) {
            api?.removeTrack(track.serverId);
          }
          dispatch({ type: "REMOVE_TRACK", roomId: state.selectedRoom || "", trackId: track.id, peerId: id });
        }}
      />
    </div>
  );
};
