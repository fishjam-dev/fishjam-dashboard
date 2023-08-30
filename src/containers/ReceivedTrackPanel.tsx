import { JsonComponent } from "../components/JsonComponent";
import { TrackMetadata } from "../jellyfish.types";
import { useState } from "react";
import { TrackEncoding } from "@jellyfish-dev/react-client-sdk";
import { CopyToClipboardButton } from "../components/CopyButton";
import { AudioPlayer } from "../components/AudioPlayer";
import { PiMicrophoneFill } from "react-icons/pi";
import VideoPlayer from "../components/VideoPlayer";
import { atomFamily } from "jotai/utils";
import { atom, useAtom } from "jotai";
type TrackPanelProps = {
  clientId: string;
  trackId: string;
  stream: MediaStream | null;
  trackMetadata: TrackMetadata | null;
  changeEncodingReceived: (trackId: string, encoding: TrackEncoding) => void;
  vadStatus: string | null;
  encodingReceived: TrackEncoding | null;
};

const isTalking = (vadStatus: string | null) => vadStatus !== "silence";

const activeSimulcastAtom = atomFamily(() => atom(""));

export const ReceivedTrackPanel = ({
  clientId,
  trackId,
  stream,
  vadStatus,
  trackMetadata,
  encodingReceived,
  changeEncodingReceived,
}: TrackPanelProps) => {
  const [simulcastReceiving, setSimulcastReceiving] = useAtom(activeSimulcastAtom(trackId));

  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="w-full flex flex-col ">
      <label className="label">
        <span className="label-text">{trackId.split(":")[1]}</span>
        <CopyToClipboardButton text={trackId} />
      </label>
      {stream?.getVideoTracks().length !== 0 ? (
        <div className="flex flex-row flex-wrap  indicator justify-between">
          {isTalking(vadStatus) && (
            <span className=" indicator-item indicator-start badge badge-success badge-md ml-4 mt-1">
              <PiMicrophoneFill className="w-5 h-5" />
            </span>
          )}
          <VideoPlayer size={"48"} stream={stream} />
          <div className="ml-2 flex place-content-center flex-col ">
            <h1 className="text-lg ml-3">Simulcast:</h1>
            <div className="flex flex-row flex-wrap">
              <h1 className="ml-1 text-lg">Current encoding:</h1>
              <h1 className="ml-3 text-lg">{encodingReceived}</h1>
            </div>
            <div className="flex flex-row flex-wrap">
              <h1 className="ml-1 align-middle place-items-center flex text-lg">Encoding preference:</h1>
              <div className="flex flex-row flex-wrap w-44 ml-2 justify-between ">
                <label className="label cursor-pointer flex-row">
                  <span className="label-text mr-2">l</span>
                  <input
                    type="radio"
                    value="l"
                    name={`radio-${trackId}-${clientId}`}
                    className="radio checked:bg-blue-500"
                    checked={simulcastReceiving === "l"}
                    onChange={(e) => {
                      setSimulcastReceiving(e.target.value);
                      changeEncodingReceived(trackId, "l");
                    }}
                  />
                </label>
                <label className="label cursor-pointer flex-row">
                  <span className="label-text mr-2">m</span>
                  <input
                    type="radio"
                    value="m"
                    name={`radio-${trackId}-${clientId}`}
                    className="radio checked:bg-blue-500"
                    checked={simulcastReceiving === "m"}
                    onChange={(e) => {
                      setSimulcastReceiving(e.target.value);
                      changeEncodingReceived(trackId, "m");
                    }}
                  />
                </label>
                <label className="label cursor-pointer flex-row">
                  <span className="label-text mr-2">h</span>
                  <input
                    type="radio"
                    value="h"
                    name={`radio-${trackId}-${clientId}`}
                    className="radio checked:bg-blue-500"
                    checked={simulcastReceiving === "h" || simulcastReceiving === null}
                    onChange={(e) => {
                      setSimulcastReceiving(e.target.value);
                      changeEncodingReceived(trackId, "h");
                    }}
                  />
                </label>
              </div>
            </div>
            <button
              className="btn btn-sm m-2"
              onClick={() => {
                setShow(!show);
              }}
            >
              {show ? "Hide" : "Show"} metadata
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row indicator justify-between">
          <div className="py-8 px-16 bg-gray-200 h-fit w-fit rounded-md">
            <AudioPlayer size={"65"} stream={stream} />
          </div>
          <button
            className="btn btn-sm m-2 w-full flex"
            onClick={() => {
              setShow(!show);
            }}
          >
            {show ? "Hide" : "Show"} metadata
          </button>
        </div>
      )}
      {show && <JsonComponent state={JSON.parse(JSON.stringify(trackMetadata))} />}
    </div>
  );
};
