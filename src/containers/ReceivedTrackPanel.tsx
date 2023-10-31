import { JsonComponent } from "../components/JsonComponent";
import { TrackMetadata } from "../jellyfish.types";
import { useState } from "react";
import { SimulcastConfig, TrackEncoding } from "@jellyfish-dev/react-client-sdk";
import { CopyToClipboardButton } from "../components/CopyButton";
import VideoPlayer from "../components/VideoPlayer";
import { atomFamily } from "jotai/utils";
import { atom, useAtom } from "jotai";
import AudioVisualizer from "../components/AudioVisualizer";
import { BiSolidVolumeMute, BiSolidVolumeFull } from "react-icons/bi";

type TrackPanelProps = {
  clientId: string;
  trackId: string;
  stream: MediaStream | null;
  trackMetadata: TrackMetadata | null;
  changeEncodingReceived: (trackId: string, encoding: TrackEncoding) => void;
  vadStatus: string | null;
  encodingReceived: TrackEncoding | null;
  kind: string | undefined;
  simulcastConfig: SimulcastConfig | null;
};

const activeSimulcastAtom = atomFamily(() => atom(""));

export const ReceivedTrackPanel = ({
  clientId,
  trackId,
  stream,
  vadStatus,
  trackMetadata,
  encodingReceived,
  kind,
  changeEncodingReceived,
  simulcastConfig,
}: TrackPanelProps) => {
  const [simulcastReceiving, setSimulcastReceiving] = useAtom(activeSimulcastAtom(trackId));
  const [muted, setMuted] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="w-full flex flex-col ">
      <label className="label">
        <span className="label-text">{trackId.split(":")[1]}</span>
        <CopyToClipboardButton text={trackId} />
      </label>
      {kind === "video" ? (
        <div className="flex flex-row indicator justify-between gap-2">
          <VideoPlayer size={"48"} stream={stream} />
          <div className="flex place-content-center flex-col ">
            <h1 className="text-lg">Simulcast: {simulcastConfig?.enabled ? "true" : "false"} </h1>
            <div className="flex flex-row flex-wrap gap-2">
              <span className="text-lg">Current encoding:</span>
              <span className="text-lg">{encodingReceived}</span>
            </div>
            {simulcastConfig?.enabled && (
              <div className="flex flex-row flex-wrap">
                <h1 className="align-middle place-items-center flex text-lg">Encoding preference:</h1>
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
            )}
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
          <div
            className={` bg-gray-200 h-fit w-fit rounded-md ${
              vadStatus !== "silence" && !muted ? "border-green-500 border-2" : "border-2"
            }`}
          >
            <div className="indicator-item indicator-start z-20">
              {muted ? (
                <button
                  className="btn btn-sm btn-error ml-2 mt-2 max-w-xs"
                  onClick={() => {
                    setMuted(false);
                  }}
                >
                  <BiSolidVolumeMute size={20} />
                </button>
              ) : (
                <button
                  className="btn btn-sm ml-2 mt-2 max-w-xs"
                  onClick={() => {
                    setMuted(true);
                  }}
                >
                  <BiSolidVolumeFull size={20} />
                </button>
              )}
            </div>
            <AudioVisualizer stream={stream} muted={muted} />
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
