import { Track } from "@jellyfish-dev/react-client-sdk/dist/state.types";
import { CloseButton } from "../components/CloseButton";
import { TrackMetadata } from "../jellyfish.types";
import { LocalTrack } from "./Client";
import VideoPlayer from "../components/VideoPlayer";
import { JsonComponent } from "../components/JsonComponent";
import { TrackEncoding } from "@jellyfish-dev/react-client-sdk";
import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { useStore } from "./RoomsContext";
import clsx from "clsx";

type StreamedTrackCardProps = {
  trackInfo: LocalTrack;
  roomId: string;
  peerId: string;
  trackMetadata: string;
  allTracks: Record<string, Track<TrackMetadata>> | undefined;
  removeTrack: (trackId: string) => void;
  simulcastTransfer: boolean;
  changeEncoding: (trackId: string, encoding: TrackEncoding, desiredState: boolean) => void;
};

export const StreamedTrackCard = ({
  trackInfo,
  roomId,
  peerId,
  trackMetadata,
  allTracks,
  removeTrack,
  simulcastTransfer,
  changeEncoding,
}: StreamedTrackCardProps) => {
  const { dispatch } = useStore();

  const [isEncodingActive, setEncodingActive] = useState<boolean[]>([
    trackInfo.encodings?.includes("l") || false,
    trackInfo.encodings?.includes("m") || false,
    trackInfo.encodings?.includes("h") || false,
  ]);
  const simulcast = useState<boolean>(simulcastTransfer);
  const [expandedTrackId, setExpandedTrackId] = useState<boolean>(false);
  return (
    <div className="card w-150 bg-base-100 shadow-xl p-2 m-2 indicator">
      <div className=" card-body p-2 m-2 flex flex-col">
        <CloseButton
          onClick={() => {
            if (!trackInfo) return;
            removeTrack(trackInfo.id);
            dispatch({ type: "REMOVE_TRACK", roomId, peerId, trackId: trackInfo.id });
          }}
        />
        <span
          className={`${expandedTrackId ? "whitespace-normal" : "whitespace-nowrap"} cursor-pointer break-all pr-6`}
          onClick={() => setExpandedTrackId(!expandedTrackId)}
        >
          Track ID:{" "}
          {trackInfo.id.length > 20 && !expandedTrackId
            ? `...${trackInfo.id.slice(trackInfo.id.length - 20, trackInfo.id.length)}`
            : trackInfo.id}
        </span>
        {Object.values(allTracks || {})
          .filter(({ trackId: id }) => id === trackInfo.id)
          .map(({ trackId, stream }) => (
            <div key={trackId} className="flex flex-col">
              <div className="w-full flex flex-row-reverse place-content-between">
                <div className="w-48  flex ">
                  {stream && trackInfo.type === "video" ? (
                    <VideoPlayer stream={stream} />
                  ) : (
                    <div key={trackId} className="flex flex-row bg-gray-200 p-8 px-14 rounded-md">
                      <FaMicrophone size={64} className="text-3xl mr-2" />
                    </div>
                  )}
                </div>
                {simulcast[0] && (
                  <div className=" flex-row">
                    Active simulcast channels:{" "}
                    <label className="label cursor-pointer">
                      <span className="label-text mr-2">Low</span>
                      <input
                        key={trackInfo.id + "l"}
                        type="checkbox"
                        checked={isEncodingActive[0]}
                        className="checkbox"
                        onChange={() => {
                          changeEncoding(trackId, "l", !trackInfo.encodings?.includes("l"));
                          setEncodingActive([!isEncodingActive[0], isEncodingActive[1], isEncodingActive[2]]);
                        }}
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text mr-2">Medium</span>
                      <input
                        key={trackInfo.id + "m"}
                        type="checkbox"
                        checked={isEncodingActive[1]}
                        className="checkbox"
                        onChange={() => {
                          changeEncoding(trackId, "m", !trackInfo.encodings?.includes("m"));
                          setEncodingActive([isEncodingActive[0], !isEncodingActive[1], isEncodingActive[2]]);
                        }}
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text mr-2">High</span>
                      <input
                        key={trackInfo.id + "h"}
                        type="checkbox"
                        checked={isEncodingActive[2]}
                        className="checkbox"
                        onChange={() => {
                          changeEncoding(trackId, "l", !trackInfo.encodings?.includes("l"));
                          setEncodingActive([isEncodingActive[0], isEncodingActive[1], !isEncodingActive[2]]);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  {trackMetadata !== "" && (
                    <button
                      className="btn btn-sm m-2 max-w-xs"
                      onClick={() => {
                        dispatch({
                          type: "SET_SHOW_METADATA",
                          trackId: trackInfo.id,
                          peerId: peerId,
                          roomId: roomId,
                          isOpen: trackInfo.isMetadataOpened,
                        });
                      }}
                    >
                      {trackInfo?.isMetadataOpened ? "Hide metadata" : "Show metadata"}
                    </button>
                  )}

                  <button
                    className={clsx("btn btn-sm m-2 max-w-xs", trackInfo.enabled ? "btn-error" : "btn-success")}
                    onClick={() => {
                      dispatch({
                        type: "SET_TRACK_ENABLE",
                        trackId: trackInfo.id,
                        peerId: peerId,
                        roomId: roomId,
                        enable: !trackInfo.enabled,
                      });
                    }}
                  >
                    {trackInfo.enabled ? "Disable track" : "Enable track"}
                  </button>
                </div>
                {trackInfo.isMetadataOpened && <JsonComponent state={JSON.parse(trackMetadata || "")} />}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
