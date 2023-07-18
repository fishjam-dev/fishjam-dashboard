import VideoPlayer from '../components/VideoPlayer';
import {JsonComponent} from '../components/JsonComponent';
import { TrackMetadata } from '../jellyfish.types';
import { useState } from 'react';
import { TrackEncoding } from '@jellyfish-dev/membrane-webrtc-js';

type TrackPanelProps = {
    trackId: string;
    stream: MediaStream | null;
    trackMetadata: TrackMetadata | null;
    changeEncodingRecieved: (trackId: string, encoding: TrackEncoding) => void;
};

export const RecievedTrackPanel = ({
    trackId,
    stream,
    trackMetadata,
    changeEncodingRecieved,
}:TrackPanelProps ) => {
    const [simulcastRecieving, setSimulcastRecieving] = useState<string>('h');
    
    return (
        <div key={trackId} className='w-full flex flex-col'>
                        <label className='label'>
                            <span className='label-text'>{trackId.split(":")[1]}</span>
                        </label>
                        <VideoPlayer stream={stream} />
                        <JsonComponent state={JSON.parse(JSON.stringify(trackMetadata))} />
                        <div>Simulcast receiving preferences:</div>
                        <div className='form-control flex-row'>
                          <label className='label cursor-pointer flex-col'>
                            <span className='label-text'>l</span>
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
                          <label className='label cursor-pointer flex-col'>
                            <span className='label-text'>m</span>
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
                          <label className='label cursor-pointer flex-col'>
                            <span className='label-text'>h</span>
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
    );
}