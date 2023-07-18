import { useState } from 'react';
import { TrackSettingsPanel } from './TrackSettingsPanel';
import { DeviceIdToStream, StreamInfo, VideoDeviceSelector } from '../components/VideoDeviceSelector';
import { useLocalStorageState, useLocalStorageStateString, useLocalStorageStateArray } from '../components/LogSelector';
import { VscSettings } from 'react-icons/vsc';
import { TrackEncoding } from '@jellyfish-dev/membrane-webrtc-js';

type ModalProps = {
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
};

export const StreamingSettingsModal = ({
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
}: ModalProps) => {
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

  const handleClick = (tab: 'Image' | 'Settings' | 'Metadata') => {
    setActiveTab(tab);
  };

  const handleChange = () => {
    setAttachMetadata(attachMetadata);
    setMaxBandwidth(maxBandwidth);
    setSimulcast(simulcast);
    setTrackMetadata(trackMetadata);
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
      <div className='tooltip tooltip-bottom tooltip-primary' data-tip='Stream settings'>
        <label htmlFor={name} className='btn btn-sm btn-info    m-2'>
          <VscSettings size={20} />
        </label>
      </div>
      <input type='checkbox' id={name} className='modal-toggle' />
      <div className='modal fixed '>
        <div className='modal-box absolute min-w-700 items-center top-40 bottom-1/4 justify-start overflow-y-auto'>
          <div className='tabs'>
            <nav className='flex space-x-2' aria-label='Tabs' role='tablist'>
              <div className='tabs'>
                <button className={`tab tab-lg tab-lifted ${activeTab === "Image" ?'tab-active' :''}`} onClick={() => setActiveTab("Image")}>Image</button>
                <button className={`tab tab-lg tab-lifted ${activeTab === "Settings" ?'tab-active' :''}`} onClick={() => setActiveTab("Settings")}>Settings</button>
                <button className={`tab tab-lg tab-lifted ${activeTab === "Metadata" ?'tab-active' :''}`} onClick={() => setActiveTab("Metadata")}>Metadata</button>
              </div>
            </nav>
          </div>
          <div className='bg-gray-50 dark:bg-inherit'>
            {activeTab === 'Image' && (
              <VideoDeviceSelector
                selectedVideoId={selectedVideoId}
                activeVideoStreams={activeVideoStreams}
                setActiveVideoStreams={setActiveVideoStreams}
                setSelectedVideoId={setSelectedVideoId}
              />
            )}
            {activeTab === 'Settings' && (
              <TrackSettingsPanel
                currentEncodings={currentEncodings}
                setCurrentEncodings={setCurrentEncodings}
                name={name}
                client={client}
                simulcast={simulcast}
                setSimulcast={setSimulcast}
                maxBandwidth={maxBandwidth}
                setMaxBandwidth={setMaxBandwidth}
              ></TrackSettingsPanel>
            )}
            {activeTab === 'Metadata' && (
              <div className='flex-col flex-wrap'>
                <div className='form-control flex flex-row flex-wrap content-center'>
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
                    <span className='label-text ml-2'>Attach metadata</span>
                  </label>
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
            )}
          </div>
          <div className='modal-action'>
            <button className='btn' onClick={useSaveToStorage}>
              Save defaults
            </button>
            <label htmlFor={name} className='btn btn-primary' onClick={handleChange}>
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
