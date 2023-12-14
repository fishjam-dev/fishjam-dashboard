type Props = {
  maxPeers?: number | null;
};

export const MaxPeersBadge = ({ maxPeers }: Props) => {
  return (
    <div className="tooltip" data-tip="max peers">
      <div className="badge badge-info">{maxPeers ?? "not specified"}</div>
    </div>
  );
};
