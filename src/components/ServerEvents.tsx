import { useEffect, useState } from "react";
import { JsonComponent } from "./JsonComponent";
import { useServerSdk } from "./ServerSdkContext";
import * as _m0 from "protobufjs/minimal";

import { ServerMessage } from "../protos/jellyfish/server_notifications";
export const ServerEvents = ({ displayed }: { displayed: boolean }) => {
  const [serverMessages, setServerMessages] = useState<ServerMessage[]>([]);
  const { serverWebsocket } = useServerSdk();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (event: any) => {
    const uint8array = new Uint8Array(event.data);
    console.log(event.lastEventId);
    console.log("called");
    try {
      const unpacked = ServerMessage.decode(uint8array);
      setServerMessages((prevState) => [...prevState, unpacked]);
    } catch (e) {
      console.log("recieved invalid data");
      console.log(e);
      console.log(uint8array);
    }
  };
  useEffect(() => {
    serverWebsocket?.addEventListener("message", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverWebsocket]);

  return (
    <div className={displayed ? "" : "hidden"}>
      {serverMessages.map((message, index) => (
        <JsonComponent key={index} state={message}></JsonComponent>
      ))}
    </div>
  );
};
