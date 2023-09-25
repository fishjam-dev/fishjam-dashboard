import { GiOctopus } from "react-icons/gi";
import { Quality, createStream } from "../utils/createMockStream";
import { DeviceIdToStream } from "./StreamingDeviceSelector";
import { AiFillHeart } from "react-icons/ai";
import { FaFrog } from "react-icons/fa";
import { LuTestTube } from "react-icons/lu";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { useState } from "react";
import { DeviceInfo } from "../containers/StreamingCard";

type MockProps = {
  id: string;
  activeStreams: DeviceIdToStream | null;
  setActiveVideoStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;
  selectedDeviceId: DeviceInfo | null;
  setSelectedDeviceId: (info: DeviceInfo | null) => void;
};

type StreamGenerator = {
  create: () => { stop: () => void; stream: MediaStream };
  id: string;
};

export const heartStream: StreamGenerator = {
  create: () => createStream("💜", "black", "high", 24),
  id: "HEART_STREAM",
};
export const frogStream: StreamGenerator = {
  create: () => createStream("🐸", "black", "high", 24),
  id: "FROG_STREAM",
};
export const elixirStream: StreamGenerator = {
  create: () => createStream("🧪", "black", "high", 24),
  id: "ELIXIR_STREAM",
};
export const octopusStream: StreamGenerator = {
  create: () => createStream("🐙", "black", "high", 24),
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

export const MockVideoPanel = ({ setActiveVideoStreams, setSelectedDeviceId, id }: MockProps) => {
  const [defaultMockQuality, _] = useAtom(mockQualityAtom);
  const [mockQuality, setMockQuality] = useState<Quality>(defaultMockQuality);

  return (
    <div className="flex card-body  bg-base-100 shadow-xl rounded-md flex-row flex-wrap gap-2 p-4">
      <div className=" p-1 flex m-2 w-full flex-row flex-1 items-center justify-evenly">
        {mockStreams.map((stream, index) => (
          <button
            key={index}
            className="btn btn-sm btn-success m-2"
            onClick={() => {
              const uuid = crypto.randomUUID();
              const stream = mockStreams[index].create().stream;
              setSelectedDeviceId({ id: mockStreamNames[index] + uuid, type: "video", stream: stream });
              setActiveVideoStreams((prev) => {
                return {
                  ...prev,
                  [mockStreamNames[index] + uuid]: {
                    stream: stream,
                    id: mockStreamNames[index] + uuid,
                  },
                };
              });
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
