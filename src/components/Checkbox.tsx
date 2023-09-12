type Props = {
  setValue: (value: boolean) => void;
  value: boolean;
  name: string;
};

export const Checkbox = ({ setValue, value, name }: Props) => {
  return (
    <div className="form-control flex flex-row flex-wrap content-center">
      <label className="label cursor-pointer">
        <input
          className="checkbox"
          id={name}
          type="checkbox"
          checked={value}
          onChange={() => {
            setValue(!value);
          }}
        />
        <span className="label-text ml-2">{name}</span>
      </label>
    </div>
  );
};
