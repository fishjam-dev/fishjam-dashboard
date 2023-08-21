import type { PeerStatus } from "@jellyfish-dev/react-client-sdk";

export const BadgeStatus = ({ status }: { status: PeerStatus }) => {
  const getBadeClass = () => {
    switch (status) {
      case "joined":
        return "badge badge-sm  badge-success";
      case "error":
        return "badge badge-sm  badge-error";
      case null:
        return "hidden";
      default:
        return "text-info loading loading-spinner";
    }
  };

  return <span className={` ${getBadeClass()}`}></span>;
};
