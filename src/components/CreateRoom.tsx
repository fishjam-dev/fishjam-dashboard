import React, { ChangeEvent, FC } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Props = {
  refetchIfNeeded: () => void;
};

type EnforceEncoding = "h264" | "vp8";

const videoCodecAtom = atomWithStorage<EnforceEncoding>("enforce-encoding", "vp8");
const maxPeersAtom = atomWithStorage("max-peers", "10");

const isRoomEnforceEncoding = (value: string): value is EnforceEncoding => value === "h264" || value === "vp8";

const CreateRoom: FC<Props> = ({ refetchIfNeeded }) => {
  const { roomApi } = useServerSdk();
  const [videoCodec, setEnforceEncodingInput] = useAtom(videoCodecAtom);
  const [maxPeers, setMaxPeers] = useAtom(maxPeersAtom);
  const parsedMaxPeers = parseInt(maxPeers);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isRoomEnforceEncoding(event.target.value)) {
      setEnforceEncodingInput(event.target.value);
    }
  };

  return (
    <div className="tab tab-bordered border-l-2 bg-base-200 indicator h-fit flex flex-row">
      <div className="flex flex-row gap-2 items-center">
        <div className="form-control">
          <label className="flex flex-row gap-2 label cursor-pointer items-center">
            <span className="label-text">h264</span>
            <input
              type="radio"
              name="radio-10"
              value="h264"
              className="radio"
              onChange={onChange}
              checked={videoCodec === "h264"}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="flex flex-row gap-2 label cursor-pointer">
            <span className="label-text">vp8</span>
            <input
              type="radio"
              name="radio-10"
              value="vp8"
              className="radio"
              onChange={onChange}
              checked={videoCodec === "vp8"}
            />
          </label>
        </div>
        <label className="label">
          <span className="label-text">Max Peers:</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-36 h-10 m-1"
          value={maxPeers}
          onChange={(e) => (e.target.value.match(/^[0-9]*$/) ? setMaxPeers(e.target.value) : null)}
        />
        <button
          className="btn btn-sm btn-success btn-circle m-1"
          disabled={isNaN(parsedMaxPeers)}
          onClick={() => {
            roomApi
              ?.jellyfishWebRoomControllerCreate({
                maxPeers: parsedMaxPeers,
                videoCodec: videoCodec,
              })
              .then(() => {
                refetchIfNeeded();
              });
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
