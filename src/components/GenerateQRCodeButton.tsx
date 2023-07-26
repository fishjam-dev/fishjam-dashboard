import { QRCodeCanvas } from "qrcode.react";
import { BsQrCodeScan } from "react-icons/bs";

export const GenerateQRCodeButton = ({ text, description }: { text: string; description: string }) => {
  return (
    <div className="tooltip tooltip-info z-50" data-tip="SHOW QR CODE">
      <label htmlFor="my_modal_7" className="btn btn-sm mx-1 my-0">
        <BsQrCodeScan size={24} />
      </label>

      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="modal-header bg-blue-400 rounded-md">
            <h2 className="text-lg font-bold">{description}</h2>
          </div>
          <div className="modal-body py-4 flex content-center align-middle place-content-evenly bg-gray-200">
            <QRCodeCanvas value={text} size={300} bgColor="#E5E7EB" />
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </div>
  );
};
