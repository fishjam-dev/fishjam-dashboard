import { Track } from '@jellyfish-dev/react-client-sdk/dist/state.types';
import { CloseButton } from '../components/CloseButton';
import { TrackMetadata } from '../jellyfish.types';
import {track} from './Client';
import VideoPlayer from '../components/VideoPlayer';
import { JsonComponent } from '../components/JsonComponent';

type StreamedTrackCardProps = {
    trackId: track;
    tracksId: (track| null)[];
    setTracksId: (tracksId: (track | null )[]) => void;
    trackMetadata: string;
    allTracks: Record<string, Track<TrackMetadata>> | undefined;
    removeTrack: (trackId: string) => void;
    simulcastTransfer: boolean;
};
export const StreamedTrackCard = ({
trackId,
tracksId,
setTracksId,
trackMetadata,
allTracks,
removeTrack,
simulcastTransfer,
}: StreamedTrackCardProps) => {

    return (
        <div className="card w-150 bg-base-100 shadow-xl m-2 indicator">
        <div key={trackId?.id} className=' card-body m-2 flex flex-col'>
                <CloseButton onClick={() =>{
                  if (!trackId) return;
                  removeTrack(trackId.id);
                  setTracksId(tracksId.filter((track) => track?.id !== trackId.id));
                  }}/>
                    {Object.values(allTracks || {})
                      .filter(({ trackId: id }) => id === trackId.id)
                      .map(({ trackId, stream }) => (
                        <>
                          <div key={trackId} className='w-full flex flex-col'>
                            <div className='form-control flex-row'>
                            {simulcastTransfer && (
                              <div className='form-control flex-row'>
                                Active simulcast channels:{' '}
                                {tracksId
                                  .filter((track) => track?.id === trackId)
                                  .map((track) => track?.encodings?.join(', '))}
                              </div>
                            )}
                            <div className='w-40'>{stream && <VideoPlayer stream={stream} />}</div>
                            <div className='flex flex-col'>
                              {trackMetadata !== '' && (
                                <button
                                  className='btn btn-sm m-2 max-w-xs'
                                  onClick={() => {
                                    setTracksId(
                                      tracksId.map((id) => {
                                        if (id?.id === trackId) {
                                          return {
                                            id: trackId,
                                            isMetadataOpen: !id.isMetadataOpen,
                                            simulcast: id.simulcast,
                                            encodings: id.encodings,
                                          };
                                        }
                                        return id;
                                      }),
                                    );
                                  }}
                                >
                                  {tracksId
                                    .filter((track) => track?.id === trackId)
                                    .map((track) => (track?.isMetadataOpen ? 'Hide metadata' : 'Show metadata'))}
                                </button>
                              )}
                              {tracksId
                                .filter((track) => track?.id === trackId)
                                .map(
                                  (track) =>
                                    track?.isMetadataOpen && <JsonComponent state={JSON.parse(trackMetadata || '')} />,
                                )}
                            </div>
                          </div>
                          </div>
                        </>
                      ))}
                </div>
                </div>
    );
    };