import VideoPlayer from '../components/VideoPlayer';
import { JsonComponent } from '../components/JsonComponent';
import { TrackMetadata } from '../jellyfish.types';
import { useState } from 'react';
import { TrackEncoding } from '@jellyfish-dev/membrane-webrtc-js';
import { CopyToClipboardButton } from '../components/CopyButton';
import { FaMicrophone } from 'react-icons/fa';
import { AudioPlayer } from '../components/AudioPlayer';

type TrackPanelProps = {
  clientId: string;
  trackId: string;
  stream: MediaStream | null;
  trackMetadata: TrackMetadata | null;
  changeEncodingRecieved: (trackId: string, encoding: TrackEncoding) => void;
};

export const RecievedTrackPanel = ({ trackId, stream, trackMetadata, changeEncodingRecieved, clientId }: TrackPanelProps) => {
  const [simulcastRecieving, setSimulcastRecieving] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  return (
    <div key={trackId} className='w-full flex flex-col'>
      <label className='label'>
        <span className='label-text'>{trackId.split(':')[1]}</span>
        <CopyToClipboardButton text={trackId} />
      </label>
      {stream?.getVideoTracks().length !== 0 ? <div className='flex flex-row flex-wrap justify-between'>
         <VideoPlayer stream={stream} />
        <div className='flex place-content-center flex-col '>
          <h1 className='ml-5'>Recieved encoding:</h1>
         <div className='flex flex-row flex-wrap w-44    justify-between '>
         <label className='label cursor-pointer flex-col'>
            <span className='label-text'>l</span>
            <input
              type='radio'
              value='l'
              name={`radio-${trackId}-${clientId}`}
              className='radio checked:bg-blue-500'
              checked={simulcastRecieving === 'l'}
              onChange={(e) => {
                console.log(e.target.value);
                setSimulcastRecieving(e.target.value);
                changeEncodingRecieved(trackId, 'l');
              }}
            />
          </label>
          <label className='label cursor-pointer flex-col'>
            <span className='label-text'>m</span>
            <input
              type='radio'
              value='m'
              name={`radio-${trackId}-${clientId}`}
              className='radio checked:bg-blue-500'
              checked={simulcastRecieving === 'm'}
              onChange={(e) => {
                console.log(e.target.value);
                setSimulcastRecieving(e.target.value);
                changeEncodingRecieved(trackId, 'm');
              }}
            />
          </label>
          <label className='label cursor-pointer flex-col'>
            <span className='label-text'>h</span>
            <input
              type='radio'
              value='h'
              name={`radio-${trackId}-${clientId}`}
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
          <button
        className='btn btn-sm m-2'
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? 'Hide' : 'Show'} metadata
      </button>
        </div>
      </div>
      : <AudioPlayer stream={stream} />}
      {show && <JsonComponent state={JSON.parse(JSON.stringify(trackMetadata))} />}
    </div>
  );
};
