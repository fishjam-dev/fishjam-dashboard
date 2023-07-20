import VideoPlayer from './VideoPlayer';
import { DeviceIdToStream, StreamInfo } from './StreamingDeviceSelector';
import { getUserMedia } from '@jellyfish-dev/browser-media-utils';
import { CloseButton } from './CloseButton';
import { DeviceInfo } from '../containers/StreamingSettingsPanel';
import { FaMicrophone } from 'react-icons/fa';
type AudioTileProps = {
  deviceId: string;
  label: string;
  setActiveAudioStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;
  setSelectedAudioId: (cameraId: DeviceInfo | null) => void;
  selected: boolean;
  streamInfo: StreamInfo | null;
};
export const AudioTile = ({
  deviceId,
  label,
  setActiveAudioStreams,
  setSelectedAudioId,
  selected,
  streamInfo,
}: AudioTileProps) => (
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
                getUserMedia(deviceId, 'audio').then((stream) => {
                  setActiveAudioStreams((prev) => {
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
            className='flex flex-col min-w-fit indicator hover:cursor-pointer bg-gray-200 w-32 h-32  justify-center items-center rounded-md'
            onClick={() => {
              // setSelectedAudioId(streamInfo.id);
            }}
          >
            <CloseButton
              onClick={() => {
                setActiveAudioStreams((prev) => {
                  setSelectedAudioId(null);
                  const mediaStreams = { ...prev };
                  mediaStreams[deviceId].stream.getAudioTracks().forEach((track) => {
                    track.stop();
                  });
                  delete mediaStreams[deviceId];
                  return mediaStreams;
                });
              }}
            />
            {selected && <span className='indicator-item badge badge-success badge-lg'></span>}
            <FaMicrophone size='50'/> 
          </div>
        )}
      </div>
    </div>
  </div>
);
