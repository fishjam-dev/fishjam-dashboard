import { useState } from 'react';
import { DeviceIdToStream, StreamInfo, VideoDeviceSelector, mockStreamNames } from '../components/VideoDeviceSelector';
import { useLocalStorageState, useLocalStorageStateString, useLocalStorageStateArray } from '../components/LogSelector';
import { TrackEncoding } from '@jellyfish-dev/membrane-webrtc-js';
import { showToastError } from '../components/Toasts';
import { createStream } from '../utils/createMockStream';
import { getUserMedia } from '@jellyfish-dev/browser-media-utils';

type PanelProps = {
  name: string;
  client: string;
  setSimulcast: (isActive: boolean) => void;
  simulcast: boolean;
  trackMetadata: string | null;
  setTrackMetadata: (value: string | null) => void;
  maxBandwidth: string | null;
  setMaxBandwidth: (value: string | null) => void;
  attachMetadata: boolean;
  setAttachMetadata: (value: boolean) => void;
  selectedVideoId: string | null;
  setSelectedVideoId: (cameraId: string | null) => void;
  activeVideoStreams: DeviceIdToStream | null;
  setActiveVideoStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null,
  ) => void;
  currentEncodings: TrackEncoding[];
  setCurrentEncodings: (value: TrackEncoding[]) => void;
  addTrack: (stream: MediaStream) => void;
};

const emojiIdToIcon = (emojiId: string) => {
  switch (emojiId) {
    case 'HEART_STREAM':
      return '💜';
    case 'FROG_STREAM':
      return '🐸';
    case 'ELIXIR_STREAM':
      return '🧪';
    case 'OCTOPUS_STREAM':
      return '🐙';
    default:
      return 'N/A';
  }
};

export const StreamingSettingsPanel = ({
  addTrack,
  name,
  setSimulcast,
  setTrackMetadata,
  trackMetadata,
  maxBandwidth,
  setMaxBandwidth,
  simulcast,
  attachMetadata,
  setAttachMetadata,
  client,
  selectedVideoId,
  setSelectedVideoId,
  activeVideoStreams,
  setActiveVideoStreams,
  currentEncodings,
  setCurrentEncodings,
}: PanelProps) => {
  const [storageMaxBandwidth, setStorageMaxBandwidth] = useLocalStorageStateString('max-bandwidth', '0');
  const [storageSimulcast, setStorageSimulcast] = useLocalStorageState('simulcast');
  const [storageTrackMetadata, setStorageTrackMetadata] = useLocalStorageStateString('track-metadata', '');
  const [storageAttachMetadata, setStorageAttachMetadata] = useLocalStorageState('attach-metadata');
  const [storageCurrentEncodings, setStorageCurrentEncodings] = useLocalStorageStateArray('current-encodings', [
    'h',
    'm',
    'l',
  ]);
  const [storageselectedVideoId, setStorageselectedVideoId] = useLocalStorageStateString('selected-video-stream', '');
  const [activeTab, setActiveTab] = useState<'Image' | 'Settings' | 'Metadata'>('Image');
  const [encodingLow, setEncodingLow] = useState<boolean>(currentEncodings.includes('l'));
  const [encodingMedium, setEncodingMedium] = useState<boolean>(currentEncodings.includes('m'));
  const [encodingHigh, setEncodingHigh] = useState<boolean>(currentEncodings.includes('h'));

  const handleEncodingChange = (encoding: TrackEncoding) => {
    if (encoding === 'l') {
      setEncodingLow(!encodingLow);
    } else if (encoding === 'm') {
      setEncodingMedium(!encodingMedium);
    } else if (encoding === 'h') {
      setEncodingHigh(!encodingHigh);
    }
    if (currentEncodings.includes(encoding)) {
      setCurrentEncodings(currentEncodings.filter((e) => e !== encoding));
    } else {
      setCurrentEncodings([...currentEncodings, encoding]);
    }
  };

  const handleClick = (tab: 'Image' | 'Settings' | 'Metadata') => {
    setActiveTab(tab);
  };

  const handleChange = () => {
    setAttachMetadata(attachMetadata);
    setMaxBandwidth(maxBandwidth);
    setSimulcast(simulcast);
    setTrackMetadata(trackMetadata);
  };

  const getVideoStreamFromDeviceId = async (deviceId: string | null) => {
    if (!deviceId) return null;
    return getUserMedia(deviceId, 'video');
  };

  const useSaveToStorage = () => {
    setStorageAttachMetadata(attachMetadata);
    setStorageMaxBandwidth(maxBandwidth);
    setStorageSimulcast(simulcast);
    setStorageTrackMetadata(trackMetadata);
    setStorageCurrentEncodings(currentEncodings);
    setStorageselectedVideoId(selectedVideoId);
  };

  return (
    <>
      <div className='min-w-700 items-center top-40 bottom-1/4 justify-start'>
        <div className='bg-gray-50 dark:bg-inherit'>
          <VideoDeviceSelector
            selectedVideoId={selectedVideoId}
            activeVideoStreams={activeVideoStreams}
            setActiveVideoStreams={setActiveVideoStreams}
            setSelectedVideoId={setSelectedVideoId}
          />
           <div className="form-control flex flex-row flex-wrap content-center mb-2">
        <label className="label cursor-pointer">
          <input
            className="checkbox"
            id="Simulcast streaming:"
            type="checkbox"
            checked={simulcast}
            onChange={() => {
              setSimulcast(!simulcast);
            }}
          />
          <span className="text ml-2">{"Simulcast transfer:"}</span>
        </label>
        {simulcast && (
          <div className="form-control flex flex-row flex-wrap content-center">
            <span className="text ml-3 mr-3">{"Low"}</span>
            <input
              className="checkbox"
              id="l"
              type="checkbox"
              checked={encodingLow}
              onChange={() => {
                handleEncodingChange("l");
              }}
            />
            <span className="text ml-3 mr-3">{"Medium"}</span>
            <input
              className="checkbox"
              id="m:"
              type="checkbox"
              checked={encodingMedium}
              onChange={() => {
                handleEncodingChange("m");
              }}
            />
            <span className="text ml-3 mr-3">{"High"}</span>
            <input
              className="checkbox"
              id="h"
              type="checkbox"
              checked={encodingHigh}
              onChange={() => {
                handleEncodingChange("h");
              }}
            />
          </div>
        )}
      </div>
          <div className='flex flex-row'>
            <div className='flex-col flex-wrap'>
              <div className='flex flex-row flex-wrap'>
                <label className='label cursor-pointer'>
                  <input
                    className='checkbox'
                    id={name}
                    type='checkbox'
                    checked={attachMetadata}
                    onChange={() => {
                      setAttachMetadata(!attachMetadata);
                    }}
                  />
                  <span className='text ml-2'>Attach metadata</span>
                    </label>
                  <div className='flex flex-col mt-3 ml-1 mb-2 '>
                    <h3 className='text ml-4'>Bandwidth:</h3>
                    <input
                      value={maxBandwidth || ''}
                      type='text'
                      onChange={(e) => (e.target.value.match(/^[0-9]*$/) ? setMaxBandwidth(e.target.value) : null)}
                      placeholder='Max bandwidth'
                      className='input w-5/6  max-w-xs'
                    />
                  </div>
              </div>
            </div>
            <div className='flex flex-col flex-1'>
              <button className='btn btn-sm m-2' onClick={useSaveToStorage}>
                Save defaults
              </button>
              <button
                className='btn btn-sm btn-success m-2'
                onClick={() => {
                  handleChange();
                  console.log(selectedVideoId);
                  if (selectedVideoId === null) {
                    showToastError('Cannot add track because no video stream is selected');
                    return;
                  }
                  let stream: MediaStream | null = null;
                  if (mockStreamNames.includes(selectedVideoId || '')) {
                    stream = createStream(emojiIdToIcon(selectedVideoId || ''), 'black', 24).stream;
                    addTrack(stream);
                  } else {
                    getVideoStreamFromDeviceId(selectedVideoId).then((res) => {
                      if (res) {
                        addTrack(res);
                      }
                    });
                  }
                }}
              >
                Add track
              </button>
            </div>
          </div>
          {attachMetadata && (
                <div className='flex flex-col'>
                  <textarea
                    value={trackMetadata || ''}
                    onChange={(e) => {
                      setTrackMetadata(e.target.value);
                      console.log(trackMetadata);
                    }}
                    className='textarea  textarea-bordered h-60'
                    placeholder='Placeholder...'
                  ></textarea>
                </div>
              )}
        </div>
      </div>
    </>
  );
};
