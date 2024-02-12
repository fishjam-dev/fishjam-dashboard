import { useEffect, useState } from "react";
import { JsonComponent } from "./JsonComponent";
import { useServerSdk } from "./ServerSdkContext";
import { ServerMessage } from "../protos/jellyfish/server_notifications";

export const ServerEvents = ({ displayed }: { displayed: boolean }) => {
  const [serverMessages, setServerMessages] = useState<ServerMessage[]>([]);
  const { serverWebsocket } = useServerSdk();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (event: any) => {
    console.log({ event });
    const uint8array = new Uint8Array(event.data);
    try {
      const unpacked = ServerMessage.decode(uint8array);
      setServerMessages((prevState) => [...prevState, unpacked]);
    } catch (e) {
      console.error("recieved invalid data");
      console.error(e);
      console.error(uint8array);
    }
  };

  useEffect(() => {
    serverWebsocket?.addEventListener("message", handler);

    return () => {
      serverWebsocket?.removeEventListener("message", handler);
    }
  }, [serverWebsocket]);

  return (
    <div className={displayed ? "" : "hidden"}>
      <JsonComponent state={serverMessages}></JsonComponent>
    </div>
  );
};
