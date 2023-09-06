import { GoCopy, GoLink } from "react-icons/go";
import { showToastInfo } from "./Toasts";

const unsecuredCopyToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
};

const copyTokenToClipboard = (text: string) => {
  if (window.isSecureContext && navigator.clipboard) {
    window.navigator.clipboard.writeText(text);
  } else {
    unsecuredCopyToClipboard(text);
  }
  showToastInfo("Copied to clipboard", { duration: 1000 });
};

export const CopyToClipboardButton = ({ text }: { text: string }) => {
  return (
    <div className="tooltip tooltip-info z-10" data-tip="COPY">
      <button className="btn btn-sm mx-1 my-0" onClick={() => copyTokenToClipboard(text)}>
        <GoCopy size={24} />
      </button>
    </div>
  );
};

export const CopyLinkButton = ({ url }: { url: string }) => {
  return (
    <div className="tooltip tooltip-info z-10" data-tip="COPY LINK">
      <button className="btn btn-sm mx-1 my-0" onClick={() => copyTokenToClipboard(url)}>
        <GoLink size={24} />
      </button>
    </div>
  );
};
