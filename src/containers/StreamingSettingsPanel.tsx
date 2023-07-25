import { useState } from "react";
import { DeviceIdToStream, StreamingDeviceSelector, mockStreamNames } from "../components/StreamingDeviceSelector";
import { useLocalStorageState, useLocalStorageStateString, useLocalStorageStateArray } from "../components/LogSelector";
import { TrackEncoding } from "@jellyfish-dev/membrane-webrtc-js";
import { showToastError } from "../components/Toasts";
import { createStream } from "../utils/createMockStream";
import { getUserMedia } from "@jellyfish-dev/browser-media-utils";
import { createMockAudio } from "../utils/createMockAudio";
import { DEFAULT_TRACK_METADATA } from "./Client";
import { MediaType } from "@jellyfish-dev/browser-media-utils/dist/types";

export type DeviceInfo = {
  id: string;
  type: string;
};

type PanelProps = {
  name: string;
  setSimulcast: (isActive: boolean) => void;
  simulcast: boolean;
  trackMetadata: string | null;
  setTrackMetadata: (value: string | null) => void;
  maxBandwidth: string | null;
  setMaxBandwidth: (value: string | null) => void;
  attachMetadata: boolean;
  setAttachMetadata: (value: boolean) => void;
  selectedDeviceId: DeviceInfo | null;
  setSelectedDeviceId: (data: DeviceInfo | null) => void;
  activeStreams: DeviceIdToStream | null;
  setActiveStreams: (setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null) => void;
  currentEncodings: TrackEncoding[];
  setCurrentEncodings: (value: TrackEncoding[]) => void;
  addAudioTrack: (stream: MediaStream) => void;
  addVideoTrack: (stream: MediaStream) => void;
};

const emojiIdToIcon = (emojiId: string) => {
  switch (emojiId) {
    case "HEART_STREAM":
      return "💜";
    case "FROG_STREAM":
      return "🐸";
    case "ELIXIR_STREAM":
      return "🧪";
    case "OCTOPUS_STREAM":
      return "🐙";
    default:
      return "N/A";
  }
};

const checkJSON = (stringChecked: string) => {
  const trimmedString = stringChecked.trim();
  if (trimmedString == "" || trimmedString === null) return true;
  try {
    JSON.parse(trimmedString);
  } catch (e) {
    return false;
  }
  return true;
};

export const StreamingSettingsPanel = ({
  addVideoTrack,
  addAudioTrack,
  name,
  setSimulcast,
  setTrackMetadata,
  trackMetadata,
  maxBandwidth,
  setMaxBandwidth,
  simulcast,
  attachMetadata,
  setAttachMetadata,
  selectedDeviceId,
  setSelectedDeviceId,
  activeStreams,
  setActiveStreams,
  currentEncodings,
  setCurrentEncodings,
}: PanelProps) => {
  const [, setStorageMaxBandwidth] = useLocalStorageStateString("max-bandwidth", "0");
  const [, setStorageSimulcast] = useLocalStorageState("simulcast");
  const [, setStorageTrackMetadata] = useLocalStorageStateString("track-metadata", "");
  const [, setStorageAttachMetadata] = useLocalStorageState("attach-metadata");
  const [, setStorageCurrentEncodings] = useLocalStorageStateArray("current-encodings", ["h", "m", "l"]);
  const [, setStorageSelectedDeviceId] = useLocalStorageStateString("selected-device-stream", "");
  const [, setStorageSelectedDeviceType] = useLocalStorageStateString("selected-device-type", "");
  const [encodingLow, setEncodingLow] = useState<boolean>(currentEncodings.includes("l"));
  const [encodingMedium, setEncodingMedium] = useState<boolean>(currentEncodings.includes("m"));
  const [encodingHigh, setEncodingHigh] = useState<boolean>(currentEncodings.includes("h"));
  const [isJsonCorrect, setIsJsonCorrect] = useState<boolean>(true);

  const handleEncodingChange = (encoding: TrackEncoding) => {
    if (encoding === "l") {
      setEncodingLow(!encodingLow);
    } else if (encoding === "m") {
      setEncodingMedium(!encodingMedium);
    } else if (encoding === "h") {
      setEncodingHigh(!encodingHigh);
    }
    if (currentEncodings.includes(encoding)) {
      setCurrentEncodings(currentEncodings.filter((e) => e !== encoding));
    } else {
      setCurrentEncodings([...currentEncodings, encoding]);
    }
  };

  const handleChange = () => {
    setAttachMetadata(attachMetadata);
    setMaxBandwidth(maxBandwidth);
    setSimulcast(simulcast);
    setTrackMetadata(trackMetadata);
  };

  const getStreamFromDeviceId: (deviceId: string | null, mediaType: MediaType) => Promise<null | MediaStream> = async (
    deviceId: string | null,
    mediaType: MediaType,
  ) => {
    if (!deviceId) return null;
    return getUserMedia(deviceId, mediaType);
  };

  const saveToStorage = () => {
    setStorageAttachMetadata(attachMetadata);
    setStorageMaxBandwidth(maxBandwidth);
    setStorageSimulcast(simulcast);
    setStorageTrackMetadata(trackMetadata);
    setStorageCurrentEncodings(currentEncodings);
    setStorageSelectedDeviceId(selectedDeviceId?.id || "");
    setStorageSelectedDeviceType(selectedDeviceId?.type || "");
  };

  return (
    <div className="content-start place-content-between  top-40 bottom-1/4 justify-start">
      <StreamingDeviceSelector
        selectedDeviceId={selectedDeviceId}
        activeStreams={activeStreams}
        setActiveStreams={setActiveStreams}
        setSelectedDeviceId={setSelectedDeviceId}
      />
      {selectedDeviceId?.type === "video" && (
        <div className="form-control flex flex-row flex-wrap content-center ">
          <label className="label cursor-pointer">
            <input
              className="checkbox"
              id="Simulcast streaming:"
              type="checkbox"
              checked={simulcast}
              onChange={() => {
                setSimulcast(!simulcast);
              }}
            />
            <span className="text ml-2">{"Simulcast transfer:"}</span>
          </label>
          {simulcast && (
            <div className="form-control flex flex-row flex-wrap content-center">
              <span className="text ml-3 mr-3">{"Low"}</span>
              <input
                className="checkbox"
                id="l"
                type="checkbox"
                checked={encodingLow}
                onChange={() => {
                  handleEncodingChange("l");
                }}
              />
              <span className="text ml-3 mr-3">{"Medium"}</span>
              <input
                className="checkbox"
                id="m:"
                type="checkbox"
                checked={encodingMedium}
                onChange={() => {
                  handleEncodingChange("m");
                }}
              />
              <span className="text ml-3 mr-3">{"High"}</span>
              <input
                className="checkbox"
                id="h"
                type="checkbox"
                checked={encodingHigh}
                onChange={() => {
                  handleEncodingChange("h");
                }}
              />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-row">
        <div className="flex-col flex-wrap">
          <div className="flex flex-row flex-wrap">
            <label className="label cursor-pointer">
              <input
                className="checkbox"
                id={name}
                type="checkbox"
                checked={attachMetadata}
                onChange={() => {
                  setAttachMetadata(!attachMetadata);
                }}
              />
              <span className="text ml-2">Attach metadata</span>
            </label>
            <div className="flex flex-col mt-3 ml-1 mb-2 ">
              <h3 className="text ml-4">Bandwidth:</h3>
              <input
                value={maxBandwidth || ""}
                type="text"
                onChange={(e) => (e.target.value.match(/^[0-9]*$/) ? setMaxBandwidth(e.target.value) : null)}
                placeholder="Max bandwidth"
                className="input w-5/6  max-w-xs"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <button className="btn btn-sm m-2" onClick={saveToStorage}>
            Save defaults
          </button>
          <button
            className="btn btn-sm btn-success m-2"
            disabled={!isJsonCorrect}
            onClick={() => {
              console.log("selectedDeviceId", selectedDeviceId);
              if (selectedDeviceId === null || selectedDeviceId.id === "") {
                showToastError("Cannot add track because no video stream is selected");
                return;
              }
              handleChange();
              if (mockStreamNames.includes(selectedDeviceId.id || "")) {
                const stream: MediaStream | null = createStream(
                  emojiIdToIcon(selectedDeviceId.id || ""),
                  "black",
                  24,
                ).stream;
                addVideoTrack(stream);
              } else if (selectedDeviceId.id == "mock-audio") {
                addAudioTrack(createMockAudio().stream);
              } else {
                const setter = selectedDeviceId.type === "audio" ? addAudioTrack : addVideoTrack;
                const type = selectedDeviceId.type === "audio" ? "audio" : "video";
                getStreamFromDeviceId(selectedDeviceId.id, type).then((res) => {
                  if (res) {
                    setter(res);
                  }
                });
              }
            }}
          >
            Add track
          </button>
        </div>
      </div>
      {attachMetadata && (
        <div className="flex flex-col">
          <textarea
            value={trackMetadata || ""}
            onChange={(e) => {
              setIsJsonCorrect(checkJSON(e.target.value));
              setTrackMetadata(e.target.value);
            }}
            className={`textarea  textarea-bordered ${!isJsonCorrect ? `border-red-700` : ``} h-60`}
            placeholder="Placeholder..."
          ></textarea>
          <div className="flex flex-row">
            <button className="btn btn-sm m-2" onClick={() => setTrackMetadata("")}>
              Clear
            </button>
            <button
              className="btn btn-sm m-2"
              onClick={() => {
                setTrackMetadata(DEFAULT_TRACK_METADATA);
                setIsJsonCorrect(true);
              }}
            >
              Reset to default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
