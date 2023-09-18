import { SyntheticEvent, useCallback, useState } from "react";

type UseToggleResult = [boolean, () => void];

export const useToggle = (initialState = false, callback?: (newValue: boolean) => void): UseToggleResult => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState((prevState) => {
      callback?.(!prevState);
      return !prevState;
    });
  }, [callback]);

  return [state, toggle];
};

type DetailsProps = {
  summaryText: string;
  children: React.ReactNode;
  className?: string;
};

const Details = ({ summaryText, children, className }: DetailsProps) => {
  const [isOpen, toggle] = useToggle(false);

  const notBubblingToggle = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      toggle();
    },
    [toggle],
  );

  return (
    <details onToggle={notBubblingToggle} open={isOpen} className={className}>
      <summary>{summaryText}</summary>
      {isOpen && children}
    </details>
  );
};

export default Details;
