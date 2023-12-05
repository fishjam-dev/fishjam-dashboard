import { useState } from "react";
import { useLocalStorageState, useLocalStorageStateString, useLocalStorageStateArray } from "../components/LogSelector";
import { TrackEncoding } from "@jellyfish-dev/react-client-sdk";
import { createDefaultTrackMetadata } from "./Client";
import { showToastError } from "../components/Toasts";
import { DeviceInfo } from "./StreamingSettingsCard";
import { useStore } from "./RoomsContext";
import { LocalTrack } from "./Client";
import { SimulcastConfig } from "../components/SimulcastConfig";

type StreamingSettingsPanelProps = {
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
  addAudioTrack: (trackInfo: DeviceInfo) => void;
  addVideoTrack: (trackInfo: DeviceInfo) => void;
};

export const checkJSON = (stringChecked: string) => {
  const trimmedString = stringChecked.trim();
  try {
    JSON.parse(trimmedString);
  } catch (e) {
    return false;
  }
  return true;
};

const isStreamed = (device: DeviceInfo | null, track: LocalTrack) => {
  return !!track.serverId;
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
}: StreamingSettingsPanelProps) => {
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

  const [encodingValueLow, setEncodingValueLow] = useState<string>("");
  const [encodingValueMedium, setEncodingValueMedium] = useState<string>("");
  const [encodingValueHigh, setEncodingValueHigh] = useState<string>("");

  const [combinedBandwidth, setCombinedBandwidth] = useState<boolean>(false);

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

  const { state } = useStore();

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
    <div className="flex flex-col gap-2">
      {selectedDeviceId?.type === "video" && (
        <div className="form-control flex flex-col">
          <div className="grid grid-cols-2 w-full">
            <label className="label cursor-pointer justify-start">
              <input
                className="checkbox"
                id="Simulcast streaming:"
                type="checkbox"
                checked={simulcast}
                onChange={() => {
                  setSimulcast(!simulcast);
                }}
              />
              <span className="text ml-2">Simulcast transfer{simulcast ? ":" : ""}</span>
            </label>
            {simulcast && (
              <label className="label cursor-pointer justify-end">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={combinedBandwidth}
                  onChange={() => {
                    setCombinedBandwidth(!combinedBandwidth);
                  }}
                />
                <span className="text ml-2">Combined Bandwidth</span>
              </label>
            )}
          </div>
          {simulcast && (
            <div className="form-control flex flex-row flex-wrap content-center gap-2">
              <SimulcastConfig
                name="Low"
                bandwidthValue={encodingValueLow}
                bandwidthOnChange={(value: string) => {
                  setEncodingValueLow(value);
                }}
                layerOnChange={() => {
                  handleEncodingChange("l");
                }}
                layerStatus={encodingLow}
                disableBandwidthInput={combinedBandwidth}
              />
              <SimulcastConfig
                name="Mediu"
                bandwidthValue={encodingValueMedium}
                bandwidthOnChange={(value: string) => {
                  setEncodingValueMedium(value);
                }}
                layerOnChange={() => {
                  handleEncodingChange("m");
                }}
                layerStatus={encodingMedium}
                disableBandwidthInput={combinedBandwidth}
              />
              <SimulcastConfig
                name="High"
                bandwidthValue={encodingValueHigh}
                bandwidthOnChange={(value: string) => {
                  setEncodingValueHigh(value);
                }}
                layerOnChange={() => {
                  handleEncodingChange("h");
                }}
                layerStatus={encodingHigh}
                disableBandwidthInput={combinedBandwidth}
              />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {(!simulcast || combinedBandwidth) && (
          <div className="flex flex-row gap-2 content-center">
            <h3 className="text">Bandwidth:</h3>
            <input
              value={maxBandwidth || ""}
              type="text"
              onChange={(e) => (e.target.value.match(/^[0-9]*$/) ? setMaxBandwidth(e.target.value.trim()) : null)}
              placeholder="Max bandwidth (kbps)"
              className="input input-sm flex-1"
            />
          </div>
        )}

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
          </div>
        </div>
        <div className="flex flex-row flex-1 gap-2 justify-between">
          <button className="btn btn-sm" onClick={saveToStorage}>
            Save defaults
          </button>
          <button
            className="btn btn-sm btn-success"
            disabled={
              !isJsonCorrect ||
              selectedDeviceId === null ||
              selectedDeviceId.id === "" ||
              state.rooms[state.selectedRoom || ""].peers[id].tracks[selectedDeviceId.id] === undefined ||
              isStreamed(selectedDeviceId, state.rooms[state.selectedRoom || ""].peers[id].tracks[selectedDeviceId.id])
            }
            onClick={() => {
              if (selectedDeviceId === null || selectedDeviceId.id === "") {
                showToastError("Cannot add track because no video stream is selected");
                return;
              }
              if (selectedDeviceId.stream.getVideoTracks().length > 0) {
                addVideoTrack(selectedDeviceId);
              } else {
                addAudioTrack(selectedDeviceId);
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
            placeholder="Track metadata (JSON)"
          ></textarea>
          <div className="flex flex-row">
            <button className="btn btn-sm m-2" onClick={() => setTrackMetadata("")}>
              Clear
            </button>
            <button
              className="btn btn-sm m-2"
              onClick={() => {
                setTrackMetadata(createDefaultTrackMetadata(selectedDeviceId?.type || "unknown"));
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
