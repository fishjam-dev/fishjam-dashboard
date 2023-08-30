import protobuf from "protobufjs";

export type RoomCrashed = {
  room_id: string;
};
export type PeerConnected = {
  room_id: string;
  peer_id: string;
};
export type PeerDisconnected = {
  room_id: string;
  peer_id: string;
};
export type PeerCrashed = {
  room_id: string;
  peer_id: string;
};
export type ComponentCrashed = {
  room_id: string;
  component_id: string;
};
// eslint-disable-next-line @typescript-eslint/ban-types
export type Authenticated = {};

export type AuthRequest = {
  token: string;
};
export enum EventType {
  EVENT_TYPE_UNSPECIFIED = 0,
  EVENT_TYPE_SERVER_NOTIFICATION = 1,
  EVENT_TYPE_METRICS = 2,
}
export type SubscribeRequest = {
  event_type: EventType;
};
export type SubscribeResponse = {
  event_type: EventType;
};
export type RoomCreated = {
  room_id: string;
};
export type RoomDeleted = {
  room_id: string;
};
export type MetricsReport = {
  metrics: string;
};
export type HlsPlayable = {
  room_id: string;
  component_id: string;
};
export type ServerMessage = {
  roomCrashed?: RoomCrashed | undefined;
  peerConnected?: PeerConnected | undefined;
  peerDisconnected?: PeerDisconnected | undefined;
  peerCrashed?: PeerCrashed | undefined;
  componentCrashed?: ComponentCrashed | undefined;
  authenticated?: Authenticated | undefined;
  authRequest?: AuthRequest | undefined;
  subscribeRequest?: SubscribeRequest | undefined;
  subscribeResponse?: SubscribeResponse | undefined;
  roomCreated?: RoomCreated | undefined;
  roomDeleted?: RoomDeleted | undefined;
  metricsReport?: MetricsReport | undefined;
  hlsPlayable?: HlsPlayable | undefined;
};

export const decodeRoomCrashed = (reader: protobuf.Reader, length: number): RoomCrashed | undefined => {
  let room_id = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        room_id = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = room_id ? { room_id } : undefined;
  return message;
};
export const decodePeerConnected = (reader: protobuf.Reader, length: number): PeerConnected | undefined => {
  let room_id = undefined;
  let peer_id = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        room_id = reader.string();
        continue;
      }
      case 2: {
        peer_id = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = room_id && peer_id ? { room_id, peer_id } : undefined;
  return message;
};
export const decodePeerDisconnected = (reader: protobuf.Reader, length: number): PeerDisconnected | undefined => {
  let room_id = undefined;
  let peer_id = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        room_id = reader.string();
        continue;
      }
      case 2: {
        peer_id = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = room_id && peer_id ? { room_id, peer_id } : undefined;
  return message;
};
export const decodePeerCrashed = (reader: protobuf.Reader, length: number): PeerCrashed | undefined => {
  let room_id = undefined;
  let peer_id = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        room_id = reader.string();
        continue;
      }
      case 2: {
        peer_id = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = room_id && peer_id ? { room_id, peer_id } : undefined;
  return message;
};
export const decodeComponentCrashed = (reader: protobuf.Reader, length: number): ComponentCrashed | undefined => {
  let room_id = undefined;
  let component_id = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        room_id = reader.string();
        continue;
      }
      case 2: {
        component_id = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = room_id && component_id ? { room_id, component_id } : undefined;
  return message;
};
export const decodeAuthenticated = (reader: protobuf.Reader, length: number): Authenticated | undefined => {
  while (reader.pos < length) {
    const tag = reader.uint32();
    //eslint-disable-next-line
    switch (tag >>> 3) {
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = {};
  return message;
};
export const decodeAuthRequest = (reader: protobuf.Reader, length: number): AuthRequest | undefined => {
  let token = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        token = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = token ? { token } : undefined;
  return message;
};
export const decodeSubscribeRequest = (reader: protobuf.Reader, length: number): SubscribeRequest | undefined => {
  let event_type = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        event_type = reader.int32();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = event_type ? { event_type } : undefined;
  return message;
};
export const decodeSubscribeResponse = (reader: protobuf.Reader, length: number): SubscribeResponse | undefined => {
  let event_type = undefined;
  const end = reader.pos + length;
  while (reader.pos < end) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        event_type = reader.int32();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = event_type ? { event_type } : undefined;
  return message;
};
export const decodeRoomCreated = (reader: protobuf.Reader, length: number): RoomCreated | undefined => {
  let room_id = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        room_id = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = room_id ? { room_id } : undefined;
  return message;
};
export const decodeRoomDeleted = (reader: protobuf.Reader, length: number): RoomDeleted | undefined => {
  let room_id = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        room_id = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = room_id ? { room_id } : undefined;
  return message;
};
export const decodeMetricsReport = (reader: protobuf.Reader, length: number): MetricsReport | undefined => {
  let metrics = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        metrics = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = metrics ? { metrics } : undefined;
  return message;
};
export const decodeHlsPlayable = (reader: protobuf.Reader, length: number): HlsPlayable | undefined => {
  let room_id = undefined;
  let component_id = undefined;
  while (reader.pos < length) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1: {
        room_id = reader.string();
        continue;
      }
      case 2: {
        component_id = reader.string();
      }
    }
    if ((tag & 7) === 4 || tag === 0) {
      break;
    }
  }
  const message = room_id && component_id ? { room_id, component_id } : undefined;
  return message;
};
