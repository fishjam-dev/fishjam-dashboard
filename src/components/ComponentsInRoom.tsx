import React, { FC } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { Component } from "../server-sdk";
import { CloseButton } from "./CloseButton";
import HlsPlayback from "./HLSPlayback";
import { CopyToClipboardButton } from "./CopyButton";
import { useStore } from "../containers/RoomsContext";

type RoomComponentProps = {
  component: Component;
  refetchIfNeeded: () => void;
};

const ComponentInRoom: FC<RoomComponentProps> = ({ component, refetchIfNeeded }) => {
  const { roomApi } = useServerSdk();
  const { state } = useStore();
  const roomId = state.selectedRoom || "";
  const isPlayable = component.type === "hls" && (component.metadata.playable || false);
  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <CloseButton
        onClick={() => {
          roomApi?.deleteComponent(roomId, component.id).then(() => {
            refetchIfNeeded();
          });
        }}
      />
      <div className="card-body p-4">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <div className="card-title">
              <div
                className={`badge badge-lg ${
                  component.type === "hls" ? "badge-info" : "badge-secondary"
                } badge-outline`}
              >
                {component.type}
              </div>
              {component.id}
              <CopyToClipboardButton text={component.id} />
            </div>
          </div>

          {component.type === "hls" && <HlsPlayback roomId={roomId} isPlayable={isPlayable} />}
        </div>
      </div>
    </div>
  );
};

type Props = {
  components: Component[] | undefined;
  refetchIfNeeded: () => void;
};

const ComponentsInRoom: FC<Props> = ({ components, refetchIfNeeded }) => (
  <div className="flex w-full flex-row flex-wrap gap-2 mx-1">
    {components &&
      Object.values(components).map((component) => (
        <ComponentInRoom key={component.id} component={component} refetchIfNeeded={refetchIfNeeded} />
      ))}
  </div>
);

export default ComponentsInRoom;
