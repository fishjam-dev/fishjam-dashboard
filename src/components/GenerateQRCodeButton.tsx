import { QRCodeCanvas } from "qrcode.react";
import { BsQrCodeScan } from "react-icons/bs";

export const GenerateQRCodeButton = ({ text }: { text: string }) => {
  return (
    <div className="tooltip tooltip-info z-50" data-tip="SHOW QR CODE">
      <label htmlFor="my_modal_7" className="btn btn-sm mx-1 my-0">
        <BsQrCodeScan size={24} />
      </label>

      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="modal-header bg-gray-200 rounded-md">
            <h2 className="text-lg font-bold">Scan this QR Code to access the room from your mobile device:</h2>
          </div>
          <div className="modal-body py-4">
            <QRCodeCanvas value={text} size={300} />
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </div>
  );
};
