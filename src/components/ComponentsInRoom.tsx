import React, { FC } from "react";
import { useServerSdk } from "./ServerSdkContext";
import { Component } from "../server-sdk";
import { CloseButton } from "./CloseButton";

type RoomComponentProps = {
  roomId: string;
  component: Component;  refetchIfNeeded: () => void;
};

const ComponentInRoom: FC<RoomComponentProps> = ({ component, roomId, refetchIfNeeded }) => {
  const { componentApi } = useServerSdk();

  return (
    <div className="w-full card bg-base-100 shadow-xl indicator">
      <CloseButton
        onClick={() => {
          componentApi?.jellyfishWebComponentControllerDelete(roomId, component.id).then((response) => {
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
                  component.type === "hls" ? "badge-primary" : "badge-secondary"
                } badge-outline`}
              >
                {component.type}
              </div>
              {component.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  roomId: string;
  components: Component[] | undefined;
  refetchIfNeeded: () => void;
};

const ComponentsInRoom: FC<Props> = ({ components, refetchIfNeeded, roomId }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {components &&
        Object.values(components).map((component) => (
          <ComponentInRoom key={component.id} component={component} roomId={roomId} refetchIfNeeded={refetchIfNeeded} />
        ))}
    </div>
  );
};

export default ComponentsInRoom;
