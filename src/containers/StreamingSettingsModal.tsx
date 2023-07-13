import { useState } from "react";
import { TrackSettingsPanel } from "./TrackSettingsPanel";
import { DeviceIdToStream, StreamInfo, VideoDeviceSelector } from "../components/VideoDeviceSelector";
import { useLocalStorageState, useLocalStorageStateString, useLocalStorageStateArray} from "../components/LogSelector";
import {VscSettings } from "react-icons/vsc";
import { TrackEncoding } from "@jellyfish-dev/membrane-webrtc-js";
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
  selectedVideoStream: StreamInfo | null;
  setSelectedVideoStream: (cameraId: StreamInfo | null) => void;
  activeVideoStreams: DeviceIdToStream | null;
  setActiveVideoStreams: (
    setter: ((prev: DeviceIdToStream | null) => DeviceIdToStream) | DeviceIdToStream | null
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
  selectedVideoStream,
  setSelectedVideoStream,
  activeVideoStreams,
  setActiveVideoStreams,
  currentEncodings,
  setCurrentEncodings,
}: ModalProps) => {
  const [storageMaxBandwidth, setStorageMaxBandwidth] = useLocalStorageStateString("max-bandwidth", "0");
    const [storageSimulcast, setStorageSimulcast] = useLocalStorageState("simulcast");
    const [storageTrackMetadata, setStorageTrackMetadata] = useLocalStorageStateString("track-metadata", "");
    const [storageAttachMetadata, setStorageAttachMetadata] = useLocalStorageState("attach-metadata");
    const [storageCurrentEncodings, setStorageCurrentEncodings] = useLocalStorageStateArray("current-encodings", ["h", "m", "l"]);
  const [activeTab, setActiveTab] = useState<"Image" | "Settings" | "Metadata">("Image");

  const handleClick = (tab: "Image" | "Settings" | "Metadata") => {
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
  };
  return (
    <>
    <div className="tooltip tooltip-bottom tooltip-primary" data-tip="Stream settings">
      <label htmlFor={name} className="btn">
        <VscSettings size={20}/>
      </label>
      </div>
      <input type="checkbox" id={name} className="modal-toggle" />
      <div className="modal fixed ">
        <div className="modal-box fixed w-1/3 h-1/2 items-center justify-start overflow-y-auto">
          <div className="tabs">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
                <button
                  type="button"
                  className="hs-tab-active:bg-white hs-tab-active:border-b-transparent hs-tab-active:text-blue-600 dark:hs-tab-active:bg-gray-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-2 bg-gray-50 text-sm font-medium text-center border text-black rounded-t-lg hover:text-gray-500 dark:bg-gray-100 dark:border-gray-100 dark:text-gray-400  dark:hover:text-gray-300"
                  id="card-type-tab-item-1"
                  onClick={() => handleClick("Image")}
                >
                  Streamed image
                </button>
                <button
                  type="button"
                  className="hs-tab-active:bg-white hs-tab-active:border-b-transparent hs-tab-active:text-blue-600 dark:hs-tab-active:bg-gray-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-2 bg-gray-200 text-sm font-medium text-center border text-black rounded-t-lg hover:text-gray-2000 dark:bg-gray-100 dark:border-gray-100 dark:text-gray-400 dark:hover:text-gray-300"
                  id="card-type-tab-item-2"
                  onClick={() => handleClick("Settings")}
                >
                  Settings
                </button>
                <button
                  type="button"
                  className="hs-tab-active:bg-white hs-tab-active:border-b-transparent hs-tab-active:text-blue-600 dark:hs-tab-active:bg-gray-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-2 bg-gray-200 text-sm font-medium text-center border text-black rounded-t-lg hover:text-gray-2000 dark:bg-gray-100 dark:border-gray-100 dark:text-gray-400 dark:hover:text-gray-300"
                  id="card-type-tab-item-3"
                  onClick={() => handleClick("Metadata")}
                >
                  Metadata
                </button>
              </nav>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-inherit">
            {activeTab === "Image" && (
              <VideoDeviceSelector
                activeVideoStreams={activeVideoStreams}
                setActiveVideoStreams={setActiveVideoStreams}
                selectedVideoStream={selectedVideoStream}
                setSelectedVideoStream={setSelectedVideoStream}
              />
            )}
            {activeTab === "Settings" && (
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
            {activeTab === "Metadata" && (
              <div className="flex-col flex-wrap">
                <div className="form-control flex flex-row flex-wrap content-center">
                  <label className="label cursor-pointer">
                    <input
                      className="checkbox"
                      id={name}
                      type="checkbox"
                      checked={attachMetadata}
                      onChange={() => {
                        setAttachMetadata(!attachMetadata);
                      }}
                    />
                    <span className="label-text ml-2">Attach metadata</span>
                  </label>
                </div>

                {attachMetadata && (
                  <div className="flex flex-col">
                    <textarea
                      value={trackMetadata || ""}
                      onChange={(e) => {
                        setTrackMetadata(e.target.value);
                        console.log(trackMetadata);
                      }}
                      className="textarea  textarea-bordered h-60"
                      placeholder="Placeholder..."
                    ></textarea>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="modal-action">
            <button className="btn" onClick={useSaveToStorage}>
              Save defaults
            </button>
            <label htmlFor={name} className="btn btn-primary" onClick={handleChange}>
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
