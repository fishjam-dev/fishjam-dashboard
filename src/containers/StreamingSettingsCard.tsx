import { TrackEncoding } from "@jellyfish-dev/react-client-sdk/.";
import { StreamingDeviceSelector } from "../components/StreamingDeviceSelector";
import { StreamingSettingsPanel } from "./StreamingSettingsPanel";
import { DeviceTile } from "../components/DeviceTile";
import { useState } from "react";
import { useStore } from "./RoomsContext";
import { TrackSource } from "./Client";

export type DeviceInfo = {
  id: string;
  type: string;
  stream: MediaStream;
};

type StreamingSettingsCardProps = {
  id: string;
  setSimulcast: (isActive: boolean) => void;
  simulcast: boolean;
  trackMetadata: string | null;
  setTrackMetadata: (value: string | null) => void;
  maxBandwidth: string | null;
  setMaxBandwidth: (value: string | null) => void;
  attachMetadata: boolean;
  setAttachMetadata: (value: boolean) => void;
  addLocalStream: (stream: MediaStream, id: string, source: TrackSource) => void;
  currentEncodings: TrackEncoding[];
  setCurrentEncodings: (value: TrackEncoding[]) => void;
  addAudioTrack: (trackInfo: DeviceInfo) => void;
  addVideoTrack: (trackInfo: DeviceInfo) => void;
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
  addLocalStream,
  currentEncodings,
  setCurrentEncodings,
}: StreamingSettingsCardProps) => {
  const { state } = useStore();
  const [selectedId, setSelectedId] = useState<DeviceInfo | null>(null);
  const tracks = Object.entries(state.rooms[state.selectedRoom || ""].peers[id].tracks || {});

  return (
    <div className="flex flex-col content-start place-content-between top-40 bottom-1/4 justify-start gap-2">
      <StreamingDeviceSelector
        id={id}
        selectedDeviceId={selectedId}
        addLocalStream={addLocalStream}
        setSelectedDeviceId={setSelectedId}
      />

      {tracks.length > 0 && (
        <div className="flex flex-row flex-wrap gap-3 justify-center">
          {tracks
            .filter(([_, track]) => track.stream.getTracks().length > 0)
            .map(([_, streamInfo]) => (
              <div key={streamInfo.id} className="w-40">
                <DeviceTile
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  id={id}
                  key={streamInfo.id}
                  streamInfo={streamInfo}
                />
              </div>
            ))}
        </div>
      )}

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
        selectedDeviceId={selectedId}
        addAudioTrack={addAudioTrack}
        addVideoTrack={addVideoTrack}
      />
    </div>
  );
};
