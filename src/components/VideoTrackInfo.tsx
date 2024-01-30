import { useEffect, useState } from "react";

type Props = {
  track?: MediaStreamTrack;
};

export const VideoTrackInfo = ({ track }: Props) => {
  const [settings, setSettings] = useState<MediaTrackSettings>({});

  useEffect(() => {
    if (!track) return;
    const id = setInterval(() => {
      setSettings(track.getSettings());
    }, 200);

    return () => {
      clearInterval(id);
    };
  }, [track]);

  if (!track) return <div></div>;

  const { width, height, frameRate } = settings;
  const floorFrameRate = frameRate ? Math.floor(frameRate) : undefined;

  return (
    <div className="flex flex-col gap-1">
      <div>
        <span>Width</span> <span>{width}</span>
      </div>
      <div>
        <span>Height</span> <span>{height}</span>
      </div>
      <div>
        <span>Frame rate</span> <span>{florFrameRate}</span>
      </div>
    </div>
  );
};
