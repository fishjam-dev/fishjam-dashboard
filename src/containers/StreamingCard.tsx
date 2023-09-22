import { TrackEncoding } from "@jellyfish-dev/react-client-sdk/.";
import { DeviceIdToStream, StreamingDeviceSelector } from "../components/StreamingDeviceSelector";
import { StreamingSettingsPanel } from "./StreamingSettingsPanel";
import { DeviceTile } from "../components/DeviceTile";
import { LocalTrack } from "./Client";

const isPlaing = (tracks: Record<string, LocalTrack>, streamId: string) => {
  return Object.values(tracks).filter((track) => track.stream.id === streamId);
};

export type DeviceInfo = {
  id: string;
  type: string;
};

type StreamingCardProps = {
  id: string;
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
  tracks: Record<string, LocalTrack>;
};

export const StreamingSettingsCard = ({
  addVideoTrack,
  addAudioTrack,
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
  setSelectedDeviceId,
  activeStreams,
  setActiveStreams,
  currentEncodings,
  setCurrentEncodings,
  tracks,
}: StreamingCardProps) => {
  return (
    <div className="content-start place-content-between top-40 bottom-1/4 justify-start">
      <StreamingDeviceSelector
        selectedDeviceId={selectedDeviceId}
        activeStreams={activeStreams}
        setActiveStreams={setActiveStreams}
        setSelectedDeviceId={setSelectedDeviceId}
      />

      <div className="flex flex-row flex-wrap gap-2 p-4">
        {Object.entries(activeStreams || {}).map(([_, streamInfo]) => (
          <div
            key={streamInfo.id}
            className=" w-20"
            onClick={() => {
              setSelectedDeviceId({ id: streamInfo.id, type: "video" });
            }}
          >
            <DeviceTile
              id={id}
              playing={isPlaing(tracks, streamInfo.stream.id)}
              activeStreams={activeStreams}
              setActiveStreams={setActiveStreams}
              key={streamInfo.id}
              streamInfo={streamInfo}
              addAudioTrack={addAudioTrack}
              addVideoTrack={addVideoTrack}
            />
          </div>
        ))}
      </div>

      <StreamingSettingsPanel
        id={id}
        setSimulcast={setSimulcast}
        simulcast={simulcast}
        trackMetadata={trackMetadata}
        setTrackMetadata={setTrackMetadata}
        maxBandwidth={maxBandwidth}
        setMaxBandwidth={setMaxBandwidth}
        attachMetadata={attachMetadata}
        setAttachMetadata={setAttachMetadata}
        currentEncodings={currentEncodings}
        setCurrentEncodings={setCurrentEncodings}
        selectedDeviceId={selectedDeviceId}
      />
    </div>
  );
};
