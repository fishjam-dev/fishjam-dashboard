import { QRCodeCanvas } from "qrcode.react";
import { BsQrCodeScan } from "react-icons/bs";

export const GenerateQRCodeButton = ({ textToQR, description }: { textToQR: string; description: string }) => {
  return (
    <div className="tooltip tooltip-info z-50" data-tip="SHOW QR CODE">
      <label htmlFor={textToQR} className="btn btn-sm mx-1 my-0">
        <BsQrCodeScan size={24} />
      </label>

      <input type="checkbox" id={textToQR} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="modal-header bg-info rounded-t-md">
            <h2 className="textToQR-lg font-bold p-2">{description}</h2>
          </div>
          <div className="modal-body py-4 flex content-center align-middle place-content-evenly bg-neutral-content rounded-b-md">
            <QRCodeCanvas value={textToQR} size={300} bgColor="#E5E7EB" />
          </div>
        </div>
        <label className="modal-backdrop" htmlFor={textToQR}>
          Close
        </label>
      </div>
    </div>
  );
};
