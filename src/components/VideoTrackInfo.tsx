type Props = {
  track?: MediaStreamTrack;
};

export const VideoTrackInfo = ({ track }: Props) => {
  if (!track) return <div></div>;

  const settings = track.getSettings();
  const { width, height, frameRate } = settings;

  return (
    <div className="flex flex-col gap-1">
      <div>
        <span>Width</span> <span>{width}</span>
      </div>
      <div>
        <span>Height</span> <span>{height}</span>
      </div>
      <div>
        <span>Frame rate</span> <span>{frameRate ? Math.floor(frameRate) : ""}</span>
      </div>
    </div>
  );
};
