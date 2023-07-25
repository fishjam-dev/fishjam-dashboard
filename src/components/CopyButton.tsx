import { GoCopy } from "react-icons/go";
import { showToastInfo } from "./Toasts";

export const CopyToClipboardButton = ({ text }: { text: string }) => {
  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(text);
    showToastInfo("Copied to clipboard", { duration: 1000 });
  };
  return (
    <div className="tooltip tooltip-info " data-tip="COPY">
      <button className="btn btn-sm mx-1 my-0" onClick={copyTokenToClipboard}>
        <GoCopy size={24} />
      </button>
    </div>
  );
};
