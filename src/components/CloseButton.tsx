type CloseButtonProps = {
  position?: string;
  onClick: () => void;
};

export const CloseButton = ({ position = "top", onClick }: CloseButtonProps) => (
  <div className="indicator-item indicator-start">
    <div className={`tooltip tooltip-error z-30 ${position === "left" ? "tooltip-left" : ""}`} data-tip="REMOVE">
      <button className="btn btn-circle btn-error btn-sm" onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);
