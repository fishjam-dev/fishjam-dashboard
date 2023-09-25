import { useState } from "react";
import { useLocalStorageState, useLocalStorageStateString, useLocalStorageStateArray } from "../components/LogSelector";
import { TrackEncoding } from "@jellyfish-dev/react-client-sdk";
import { DEFAULT_TRACK_METADATA } from "./Client";
import { showToastError } from "../components/Toasts";
import { DeviceInfo } from "./StreamingCard";

type PanelProps = {
  id: string;
  setSimulcast: (isActive: boolean) => void;
  simulcast: boolean;
  trackMetadata: string | null;
  setTrackMetadata: (value: string | null) => void;
  maxBandwidth: string | null;
  setMaxBandwidth: (value: string | null) => void;
  attachMetadata: boolean;
  selectedDeviceId: DeviceInfo | null;
  setAttachMetadata: (value: boolean) => void;
  currentEncodings: TrackEncoding[];
  setCurrentEncodings: (value: TrackEncoding[]) => void;
  addAudioTrack: (stream: MediaStream) => void;
  addVideoTrack: (stream: MediaStream) => void;
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
  id,
  setSimulcast,
  setTrackMetadata,
  trackMetadata,
  maxBandwidth,
  setMaxBandwidth,
  simulcast,
  attachMetadata,
  setAttachMetadata,
  selectedDeviceId,
  currentEncodings,
  setCurrentEncodings,
  addAudioTrack,
  addVideoTrack,
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
  const [screenshareAud, setScreenshareAud] = useState<boolean>(false);

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
    <div>
      {selectedDeviceId?.id === "screenshare" && (
        <div className="form-control flex flex-row flex-wrap content-center">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={screenshareAud}
              onChange={() => {
                setScreenshareAud(!screenshareAud);
              }}
            />
            <span className="text ml-2">Screenshare audio</span>
          </label>
        </div>
      )}
      {selectedDeviceId?.type === "video" && (
        <div className="form-control flex flex-row flex-wrap content-center">
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
                id={id}
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
            disabled={!isJsonCorrect || selectedDeviceId === null || selectedDeviceId.id === ""}
            onClick={() => {
              if (selectedDeviceId === null || selectedDeviceId.id === "") {
                showToastError("Cannot add track because no video stream is selected");
                return;
              }
              if (selectedDeviceId.stream.getVideoTracks().length > 0) {
                addVideoTrack(selectedDeviceId.stream);
              } else {
                addAudioTrack(selectedDeviceId.stream);
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
