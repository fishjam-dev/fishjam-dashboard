import VideoPlayer from './VideoPlayer';
import React from 'react';
import { DeviceIdToStream, StreamInfo } from './VideoDeviceSelector';
import { getUserMedia } from '@jellyfish-dev/browser-media-utils';
import { CloseButton } from './CloseButton';

type VideoTileProps = {
  deviceId: string;
  label: string;
  setActiveVideoStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;
  setSelectedVideoId: (cameraId: string | null) => void;
  selected: boolean;
  streamInfo: StreamInfo | null;
};
export const VideoTile = ({
  deviceId,
  label,
  setActiveVideoStreams,
  setSelectedVideoId,
  selected,
  streamInfo,
}: VideoTileProps) => (
  <div className='card-body flex flex-row'>
    <div className='flex flex-col w-40 indicator'>
      <div className='flex flex-row flex-wrap justify-between'>
        {!streamInfo?.stream ? (
          <div className='flex flex-col card bg-base-100 shadow-xl m-2 w-fit '>
            <div>{label}</div>
            <button
              type='button'
              className='btn btn-success btn-sm m-2'
              disabled={!!streamInfo?.stream}
              onClick={() => {
                getUserMedia(deviceId, 'video').then((stream) => {
                  setActiveVideoStreams((prev) => {
                    return {
                      ...prev,
                      [deviceId]: {
                        stream,
                        id: deviceId,
                      },
                    };
                  });
                });
              }}
            >
              Start
            </button>
          </div>
        ) : (
          <div
            className='flex flex-col min-w-fit indicator hover:cursor-pointer'
            onClick={() => {
              setSelectedVideoId(streamInfo.id);
            }}
          >
            <CloseButton
              onClick={() => {
                setActiveVideoStreams((prev) => {
                  setSelectedVideoId(null);
                  const mediaStreams = { ...prev };
                  mediaStreams[deviceId].stream.getVideoTracks().forEach((track) => {
                    track.stop();
                  });
                  delete mediaStreams[deviceId];
                  return mediaStreams;
                });
              }}
            />
            {selected && <span className='indicator-item badge badge-success badge-lg'></span>}
            <VideoPlayer stream={streamInfo.stream} />
          </div>
        )}
      </div>
    </div>
  </div>
);
