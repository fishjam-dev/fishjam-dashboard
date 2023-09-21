import { MdScreenShare } from "react-icons/md";
type Props = {
  selected: boolean;
};

export const ScreenshareTile = ({ selected }: Props) => (
  <div className="card-body rounded-md p-4">
    <div className="flex flex-col w-20 items-center rounded-md indicator bg-black">
      {selected && <span className="indicator-item badge badge-success badge-lg"></span>}
      <MdScreenShare size={46} className="text-white" />
    </div>
  </div>
);
