import VideoPlayer from '../components/VideoPlayer';
import { JsonComponent } from '../components/JsonComponent';
import { TrackMetadata } from '../jellyfish.types';
import { useState } from 'react';
import { TrackEncoding } from '@jellyfish-dev/membrane-webrtc-js';
import { CopyToClipboardButton } from '../components/CopyButton';
import { PiMicrophoneFill } from 'react-icons/pi';

type TrackPanelProps = {
  trackId: string;
  stream: MediaStream | null;
  trackMetadata: TrackMetadata | null;
  changeEncodingRecieved: (trackId: string, encoding: TrackEncoding) => void;
  vadStatus: string | null;
  encodingRecieved: TrackEncoding | null;
};

export const RecievedTrackPanel = ({
  trackId,
  stream,
  vadStatus,
  trackMetadata,
  encodingRecieved,
  changeEncodingRecieved,
}: TrackPanelProps) => {
  const isTalking = (vadStatus: string | null) => {
    if (vadStatus === 'silence') {
      return false;
    }
    return true;
  };

  const [simulcastRecieving, setSimulcastRecieving] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  return (
    <div key={trackId} className='w-full flex flex-col'>
      <label className='label'>
        <span className='label-text'>{trackId.split(':')[1]}</span>
        <CopyToClipboardButton text={trackId} />
      </label>
      <div className='indicator flex flex-row flex-wrap justify-between'>
        <VideoPlayer stream={stream} />
        {isTalking(vadStatus) && (
          <span className=' indicator-item indicator-start badge badge-success badge-md ml-4 mt-1'>
            <PiMicrophoneFill className='w-5 h-5' />
          </span>
        )}
        <div className='ml-2 flex place-content-center flex-col '>
          <h1 className='text-lg ml-3'>Simulcast:</h1>
          <div className='flex flex-row flex-wrap'>
            <h1 className='mt-1 ml-1 text-justify'>Current encoding:</h1>
            <h1 className='ml-3 text-lg'>{encodingRecieved}</h1>
          </div>
          <div className='flex flex-row flex-wrap'>
            <h1 className='ml-1'>Encoding preference:</h1>
            <div className='flex flex-row flex-wrap w-44 ml-2 justify-between '>
              <label className='label cursor-pointer flex-row'>
                <span className='label-text mr-2'>l</span>
                <input
                  type='radio'
                  value='l'
                  name={`radio-${trackId}`}
                  className='radio checked:bg-blue-500'
                  checked={simulcastRecieving === 'l'}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setSimulcastRecieving(e.target.value);
                    changeEncodingRecieved(trackId, 'l');
                  }}
                />
              </label>
              <label className='label cursor-pointer flex-row'>
                <span className='label-tex mr-2'>m</span>
                <input
                  type='radio'
                  value='m'
                  name={`radio-${trackId}`}
                  className='radio checked:bg-blue-500'
                  checked={simulcastRecieving === 'm'}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setSimulcastRecieving(e.target.value);
                    changeEncodingRecieved(trackId, 'm');
                  }}
                />
              </label>
              <label className='label cursor-pointer flex-row'>
                <span className='label-text mr-2'>h</span>
                <input
                  type='radio'
                  value='h'
                  name={`radio-${trackId}`}
                  className='radio checked:bg-blue-500'
                  checked={simulcastRecieving === 'h' || simulcastRecieving === null}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setSimulcastRecieving(e.target.value);
                    changeEncodingRecieved(trackId, 'h');
                  }}
                />
              </label>
            </div>
          </div>
          <button
            className='btn btn-sm m-2 right-0'
            onClick={() => {
              setShow(!show);
            }}
          >
            {show ? 'Hide' : 'Show'} metadata
          </button>
        </div>
      </div>

      {show && <JsonComponent state={JSON.parse(JSON.stringify(trackMetadata))} />}
    </div>
  );
};
