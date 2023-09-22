import { GiOctopus } from "react-icons/gi";
import { DeviceInfo } from "../containers/StreamingSettingsPanel";
import { createStream } from "../utils/createMockStream";
import { DeviceIdToStream } from "./StreamingDeviceSelector";
import { AiFillHeart } from "react-icons/ai";
import { FaFrog } from "react-icons/fa";
import { LuTestTube } from "react-icons/lu";

type MockProps = {
  activeStreams: DeviceIdToStream | null;
  setActiveVideoStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;
  selectedDeviceId: DeviceInfo | null;
  setSelectedDeviceId: (cameraId: DeviceInfo | null) => void;
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

export const mockStreamNames = mockStreams.map((stream) => stream.id);

export const MockVideoPanel = ({ setActiveVideoStreams, setSelectedDeviceId }: MockProps) => {
  return (
    <div className="card-body p-1 flex bg-base-100 shadow-xl m-2 w-full flex-row rounded-md flex-1 items-center justify-evenly">
      {mockStreams.map((stream, index) => (
        <>
          {/* {!activeStreams?.[mockStreamNames[index]]?.stream ? ( */}
          <button
            key={index}
            className="btn btn-sm btn-success m-2"
            // disabled={!!activeStreams?.[mockStreamNames[index]]?.stream}
            onClick={() => {
              const uuid = crypto.randomUUID();
              setSelectedDeviceId({ id: mockStreamNames[index] + uuid, type: "video" });
              setActiveVideoStreams((prev) => {
                return {
                  ...prev,
                  [mockStreamNames[index] + uuid]: {
                    stream: mockStreams[index].create().stream,
                    id: mockStreamNames[index] + uuid,
                  },
                };
              });
            }}
          >
            Start
            {mockIcons[index]}
          </button>
          {/* ) : (
            <button
              key={index}
              className="btn btn-sm btn-error m-2"
              disabled={!activeStreams?.[mockStreamNames[index]]?.stream}
              onClick={() => {
                setActiveVideoStreams((prev) => {
                  if (selectedDeviceId?.id === mockStreamNames[index]) setSelectedDeviceId(null);
                  const mediaStreams = { ...prev };
                  mediaStreams[mockStreamNames[index]].stream.getVideoTracks().forEach((track) => {
                    track.stop();
                  });
                  delete mediaStreams[mockStreamNames[index]];
                  return mediaStreams;
                });
              }}
            >
              Stop {mockIcons[index]}
            </button>
          )} */}
        </>
      ))}
    </div>
  );
};
