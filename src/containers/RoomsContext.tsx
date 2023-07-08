import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";
import { groupBy } from "rambda";
import { Room as RoomAPI, Peer as PeerApi } from "../server-sdk";
import { create, CreateNoContextJellyfishClient } from "../../../react-client-sdk/src/experimental";
import { PeerMetadata, TrackMetadata } from "../jellyfish.types";

export type RoomContext = {
  state: AppStore;
  dispatch: (action: RoomActions) => void;
};

const RoomsContext = createContext<RoomContext | undefined>(undefined);

type Props = {
  children: ReactNode;
};

type PeerState = {
  id: string;
  peerStatus: PeerApi;
  client: CreateNoContextJellyfishClient<PeerMetadata, TrackMetadata>;
};

type RoomState = {
  roomStatus: RoomAPI;
  id: string;
  peers: Record<string, PeerState>;
};

type RoomActions =
  | { type: "SET_PEERS"; peers: any }
  | { type: "UPDATE_ROOMS"; rooms: RoomAPI[] }
  | { type: "UPDATE_ROOM"; room: RoomAPI }
  | { type: "SET_ACTIVE_ROOM"; roomId: string }
  | { type: "REMOVE_ROOMS" };

type AppStore = {
  rooms: Record<string, RoomState>;
  selectedRoom: string | null;
};

type Reducer = (state: AppStore, action: RoomActions) => AppStore;
const DEFAULT_ROOM_STATE: AppStore = { rooms: {}, selectedRoom: null };

const roomReducer: Reducer = (state, action) => {
  if (action.type === "UPDATE_ROOMS") {
    const mappedRooms: RoomState[] = action.rooms.map((room) => ({
      roomStatus: room,
      id: room.id,
      peers: state.rooms[room.id]?.peers || null,
    }));

    const rooms: Record<string, RoomState[]> = groupBy((room) => room.id, mappedRooms);
    const rooms2 = Object.fromEntries(Object.entries(rooms).map(([key, value]) => [key, value[0]]));

    return { rooms: rooms2, selectedRoom: state.selectedRoom || action?.rooms[0]?.id || null };
  } else if (action.type === "REMOVE_ROOMS") {
    return DEFAULT_ROOM_STATE;
  } else if (action.type === "SET_ACTIVE_ROOM") {
    return { rooms: state.rooms, selectedRoom: action.roomId };
  } else if (action.type === "UPDATE_ROOM") {
    const roomId = action.room.id;
    const prevRoom = state?.rooms[roomId];
    const prevPeers = prevRoom?.peers;

    console.log({ prevPeers });
    const peersList: PeerState[] = action.room.peers.map((peer) => ({
      id: peer.id,
      peerStatus: peer,
      client: prevPeers?.[peer.id]?.client || create<PeerMetadata, TrackMetadata>(),
    }));

    const groupedPeers = groupBy((peer) => peer.id, peersList);
    const peersRecord = Object.fromEntries(Object.entries(groupedPeers).map(([key, value]) => [key, value[0]]));

    return {
      ...state,
      rooms: { ...state.rooms, [roomId]: { ...prevRoom, roomStatus: action.room, peers: peersRecord } },
    };
  }
  throw Error("Unhandled room reducer action!");
};

export const RoomsContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer<Reducer, AppStore>(roomReducer, DEFAULT_ROOM_STATE, () => DEFAULT_ROOM_STATE);

  useEffect(() => {
    console.log({ state });
  }, [state]);

  return <RoomsContext.Provider value={{ state, dispatch }}>{children}</RoomsContext.Provider>;
};

export const useStore = (): RoomContext => {
  const context = useContext(RoomsContext);
  if (!context) throw new Error("useRoomsContext must be used within a RoomsContextProvider");
  return context;
};
