import { GiOctopus } from "react-icons/gi";
import { Quality, createStream } from "../utils/createMockStream";
import { AiFillHeart } from "react-icons/ai";
import { FaFrog } from "react-icons/fa";
import { LuTestTube } from "react-icons/lu";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { useState } from "react";
import { DeviceInfo } from "../containers/StreamingSettingsCard";
import { v4 as uuidv4 } from "uuid";
import { TrackSource } from "../containers/Client";

type MockVideoPanelProps = {
  id: string;
  addLocalVideoStream: (stream: MediaStream, id: string, source: TrackSource, stop?: () => void) => void;
  selectedDeviceId: DeviceInfo | null;
  setSelectedDeviceId: (info: DeviceInfo | null) => void;
};

type StreamGenerator = {
  create: (quality: Quality) => { stop: () => void; stream: MediaStream };
  id: string;
};

export const heartStream: StreamGenerator = {
  create: (quality) => createStream("💜", "black", quality, 24),
  id: "HEART_STREAM",
};
export const frogStream: StreamGenerator = {
  create: (quality) => createStream("🐸", "black", quality, 24),
  id: "FROG_STREAM",
};
export const elixirStream: StreamGenerator = {
  create: (quality) => createStream("🧪", "black", quality, 24),
  id: "ELIXIR_STREAM",
};
export const octopusStream: StreamGenerator = {
  create: (quality) => createStream("🐙", "black", quality, 24),
  id: "OCTOPUS_STREAM",
};

const mockStreams = [octopusStream, elixirStream, frogStream, heartStream];

const mockIcons = [
  <GiOctopus className="ml-2" size="20" />,
  <LuTestTube className="ml-2" size="20" />,
  <FaFrog className="ml-2" size="20" />,
  <AiFillHeart className="ml-2" size="20" />,
];

const mockQualityAtom = atomWithStorage<Quality>("mock-quality", "high");

export const mockStreamNames = mockStreams.map((stream) => stream.id);

export const MockVideoPanel = ({ addLocalVideoStream, setSelectedDeviceId, id }: MockVideoPanelProps) => {
  const [defaultMockQuality, _] = useAtom(mockQualityAtom);
  const [mockQuality, setMockQuality] = useState<Quality>(defaultMockQuality);

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <div className="flex w-full flex-row flex-1 items-center justify-between">
        {mockStreams.map((stream, index) => (
          <button
            key={index}
            className="btn btn-sm btn-success"
            onClick={() => {
              const uuid = uuidv4();
              const { stream, stop } = mockStreams[index].create(mockQuality);
              const stream = mock.stream;
              const id = mockStreamNames[index] + uuid;
              setSelectedDeviceId({ id, type: "video", stream });
              addLocalVideoStream(stream, id, "mock", mock.stop);
            }}
          >
            Start
            {mockIcons[index]}
          </button>
        ))}
      </div>
      <div className="flex flex-row flex-nowrap items-center">
        <span>Canvas resolution: </span>
        <div className="form-control tooltip" data-tip="320 x 180">
          <label className="label cursor-pointer">
            <span className="label-text mr-1">Low</span>
            <input
              type="radio"
              name={id + "-quality"}
              className="radio radio-sm"
              checked={mockQuality === "low"}
              onChange={() => {
                setMockQuality("low");
              }}
            />
          </label>
        </div>
        <div className="form-control tooltip" data-tip="640 x 360">
          <label className="label cursor-pointer">
            <span className="label-text mr-1">Medium</span>
            <input
              type="radio"
              name={id + "-quality"}
              className="radio radio-sm"
              checked={mockQuality === "medium"}
              onChange={() => {
                setMockQuality("medium");
              }}
            />
          </label>
        </div>
        <div className="form-control tooltip" data-tip="1280 x 720">
          <label className="label cursor-pointer">
            <span className="label-text mr-1">High</span>
            <input
              type="radio"
              name={id + "-quality"}
              className="radio radio-sm"
              checked={mockQuality === "high"}
              onChange={() => {
                setMockQuality("high");
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
