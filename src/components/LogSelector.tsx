import { useState } from "react";
import { getBooleanValue } from "../utils/localStorageUtils";
import { atomWithStorage, atomFamily } from "jotai/utils";
import { useAtom } from "jotai";
import { REFETCH_ON_MOUNT, REFETCH_ON_SUCCESS, HLS_DISPLAY, SERVER_STATE } from "../containers/App";
type LogSelectorProps =
  | "onJoinSuccess"
  | "onJoinError"
  | "onRemoved"
  | "onPeerJoined"
  | "onPeerLeft"
  | "onPeerUpdated"
  | "onTrackReady"
  | "onTrackAdded"
  | "onTrackRemoved"
  | "onTrackUpdated"
  | "onTrackEncodingChanged"
  | "onTracksPriorityChanged"
  | "onBandwidthEstimationChanged"
  | "onEncodingChanged";

type SettingsProps = typeof HLS_DISPLAY | typeof SERVER_STATE | typeof REFETCH_ON_SUCCESS | typeof REFETCH_ON_MOUNT;

export const settingsSelectorAtom = atomFamily((name: LogSelectorProps | SettingsProps) =>
  atomWithStorage(name, false),
);

export const useLocalStorageState = (name: string): [boolean, (newValue: boolean) => void] => {
  const [value, setValueState] = useState<boolean>(getBooleanValue(name, false));

  const setValue = (newValue: boolean) => {
    setValueState(newValue);
    localStorage.setItem(name, newValue.toString());
  };

  return [value, setValue];
};

export const getStringValue = (name: string, defaultValue: string | null = null): string | null => {
  const stringValue = localStorage.getItem(name);
  if (stringValue === null || stringValue === undefined) {
    return defaultValue;
  }
  return stringValue;
};

export const useLocalStorageStateString = (
  name: string,
  defaultValue?: string,
): [string | null, (newValue: string | null) => void] => {
  const [value, setValueState] = useState<string | null>(getStringValue(name, defaultValue));

  const setValue = (newValue: string | null) => {
    setValueState(newValue);
    if (newValue === null) {
      localStorage.removeItem(name);
    } else {
      localStorage.setItem(name, newValue);
    }
  };

  return [value, setValue];
};

export const getArrayValue = (name: string, defaultValue: string[] | null = null): string[] | null => {
  const stringValue = localStorage.getItem(name);
  if (stringValue === null || stringValue === undefined) {
    return defaultValue;
  }
  return JSON.parse(stringValue);
};

export const useLocalStorageStateArray = (
  name: string,
  defaultValue: string[],
): [string[], (newValue: string[]) => void] => {
  const [value, setValueState] = useState<string[]>(
    JSON.parse(getStringValue(name, JSON.stringify(defaultValue)) || "[]"),
  );

  const setValue = (newValue: string[]) => {
    setValueState(newValue);
    localStorage.setItem(name, JSON.stringify(newValue));
  };

  return [value, setValue];
};

export const LogSelector = () => {
  return (
    <div className="card bg-base-100 shadow-xl flex flex-col p-3">
      <PersistentInput name="onJoinSuccess" />
      <PersistentInput name="onJoinError" />
      <PersistentInput name="onRemoved" />
      <PersistentInput name="onPeerJoined" />
      <PersistentInput name="onPeerLeft" />
      <PersistentInput name="onPeerUpdated" />
      <PersistentInput name="onTrackReady" />
      <PersistentInput name="onTrackAdded" />
      <PersistentInput name="onTrackRemoved" />
      <PersistentInput name="onTrackUpdated" />
      <PersistentInput name="onTrackEncodingChanged" />
      <PersistentInput name="onTracksPriorityChanged" />
      <PersistentInput name="onBandwidthEstimationChanged" />
      <PersistentInput name="onEncodingChanged" />
    </div>
  );
};

export const PersistentInput = ({ name }: { name: LogSelectorProps | SettingsProps }) => {
  const logAtom = settingsSelectorAtom(name);
  const [value, setValue] = useAtom(logAtom);

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
