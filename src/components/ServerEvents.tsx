import { useEffect, useState } from "react";
import { JsonComponent } from "./JsonComponent";
import { useServerSdk } from "./ServerSdkContext";
import * as _m0 from "protobufjs/minimal";
import {
  ServerMessage,
  decodeAuthRequest,
  decodeAuthenticated,
  decodeComponentCrashed,
  decodeHlsPlayable,
  decodeMetricsReport,
  decodePeerConnected,
  decodePeerCrashed,
  decodePeerDisconnected,
  decodeRoomCrashed,
  decodeRoomCreated,
  decodeRoomDeleted,
  decodeSubscribeRequest,
  decodeSubscribeResponse,
} from "../utils/EventsDecoder";

export const ServerEvents = ({ displayed }: { displayed: boolean }) => {
  const [serverMessages, setServerMessages] = useState<ServerMessage[]>([]);
  const { serverWebsocket } = useServerSdk();
  const decoder = (data: _m0.Reader | Uint8Array) => {
    const reader = data instanceof _m0.Reader ? data : _m0.Reader.create(data);
    const end = reader.len;
    const message: ServerMessage = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.roomCrashed = decodeRoomCrashed(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.peerConnected = decodePeerConnected(reader, reader.uint32());
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.peerDisconnected = decodePeerDisconnected(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }
          message.peerCrashed = decodePeerCrashed(reader, reader.uint32());
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }
          message.componentCrashed = decodeComponentCrashed(reader, reader.uint32());
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }
          message.authenticated = decodeAuthenticated(reader, reader.uint32());
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }
          message.authRequest = decodeAuthRequest(reader, reader.uint32());
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }
          message.subscribeRequest = decodeSubscribeRequest(reader, reader.uint32());
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }
          message.subscribeResponse = decodeSubscribeResponse(reader, reader.uint32());
          continue;
        }
        case 10: {
          if (tag !== 82) {
            break;
          }
          message.roomCreated = decodeRoomCreated(reader, reader.uint32());
          continue;
        }
        case 11: {
          if (tag !== 90) {
            break;
          }
          message.roomDeleted = decodeRoomDeleted(reader, reader.uint32());
          continue;
        }
        case 12: {
          if (tag !== 98) {
            break;
          }
          message.metricsReport = decodeMetricsReport(reader, reader.uint32());

          continue;
        }
        case 13: {
          if (tag !== 106) {
            break;
          }
          message.hlsPlayable = decodeHlsPlayable(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    // console.log(message);
    return message;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (event: any) => {
    const uint8array = new Uint8Array(event.data);
    console.log(event.lastEventId);
    console.log("called");
    try {
      const unpacked = decoder(uint8array);
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
