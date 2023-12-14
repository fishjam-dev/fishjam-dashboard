import { RoomConfigVideoCodecEnum } from "../server-sdk";
import clsx from "clsx";

type Props = {
  videoCodec?: RoomConfigVideoCodecEnum;
};

const VIDEO_CODEC_BADGE_COLOR = {
  h264: "badge-warning",
  vp8: "badge-success",
};

export const VideoCodecBadge = ({ videoCodec }: Props) => {
  return (
    <div className="tooltip" data-tip="video codec">
      <div className={clsx("badge", videoCodec ? VIDEO_CODEC_BADGE_COLOR[videoCodec] : "badge-ghost")}>
        {videoCodec ?? "not specified"}
      </div>
    </div>
  );
};
