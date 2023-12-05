export type SimulcastConfigProps = {
  name: string;
  layerStatus: boolean;
  layerOnChange: () => void;
  bandwidthValue: string;
  bandwidthOnChange: (value: string) => void;
  disableBandwidthInput: boolean;
};

export const SimulcastConfig = ({
  name,
  layerStatus,
  layerOnChange,
  bandwidthOnChange,
  bandwidthValue,
  disableBandwidthInput,
}: SimulcastConfigProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="label cursor-pointer justify-start gap-2">
        <input className="checkbox" id="l" type="checkbox" checked={layerStatus} onChange={layerOnChange} />
        <span className="text">{name}</span>
      </label>
      <div className="flex flex-col gap-2">
        <input
          disabled={!layerStatus || disableBandwidthInput}
          value={bandwidthValue}
          type="number"
          onChange={(e) => (e.target.value.match(/^[0-9]*$/) ? bandwidthOnChange(e.target.value) : null)}
          placeholder="Max bandwidth (kbps)"
          className="input input-sm"
        />
      </div>
    </div>
  );
};
