const TrackTypeValues = ["screensharing", "camera", "audio"] as const;
export type TrackType = (typeof TrackTypeValues)[number];

export type PeerMetadata = unknown;

export type TrackMetadata = {
  type: TrackType;
  active: boolean;
};
