import { TrackEncoding } from "@jellyfish-dev/membrane-webrtc-js";
import { useState } from "react";

type SettingsProps = {
  name: string;
  client: string;
  setSimulcast: (isActive: boolean) => void;
  simulcast: boolean;
  maxBandwidth: string | null;
  setMaxBandwidth: (value: string | null) => void;
  currentEncodings: TrackEncoding[];
  setCurrentEncodings: (value: TrackEncoding[]) => void;
};

export const TrackSettingsPanel = ({
  name,
  setSimulcast,
  maxBandwidth,
  setMaxBandwidth,
  simulcast,
  currentEncodings,
  setCurrentEncodings,
  client,
}: SettingsProps) => {
  const [encodingLow, setEncodingLow] = useState<boolean>(currentEncodings.includes("l"));
  const [encodingMedium, setEncodingMedium] = useState<boolean>(currentEncodings.includes("m"));
  const [encodingHigh, setEncodingHigh] = useState<boolean>(currentEncodings.includes("h"));

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

  return (
    <div>
      <div className="flex flex-col">
        <h3 className="text cursor-pointer">Bandwidth:</h3>
        <input
          value={maxBandwidth || ""}
          type="text"
          onChange={(e) => (e.target.value.match(/^[0-9]*$/) ? setMaxBandwidth(e.target.value) : null)}
          placeholder="Max bandwidth"
          className="input w-full max-w-xs"
        />
      </div>
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
          <span className="label-text ml-2">{"Simulcast transfer:"}</span>
        </label>
        {simulcast && (
          <div className="form-control flex flex-row flex-wrap content-center">
            <span className="label-text ml-3 mr-2">{"Low"}</span>
            <input
              className="checkbox"
              id="l"
              type="checkbox"
              checked={encodingLow}
              onChange={() => {
                handleEncodingChange("l");
              }}
            />
            <span className="label-text ml-2 mr-3">{"Medium"}</span>
            <input
              className="checkbox"
              id="m:"
              type="checkbox"
              checked={encodingMedium}
              onChange={() => {
                handleEncodingChange("m");
              }}
            />
            <span className="label-text ml-2 mr-3">{"High"}</span>
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
    </div>
  );
};
