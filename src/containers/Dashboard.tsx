import { REFETCH_ON_MOUNT, REFETCH_ON_SUCCESS, HLS_DISPLAY } from "./JellyfishInstance";
import { ThemeSelector } from "../components/ThemeSelector";
import { LogSelector, PersistentInput, PersistentExtras } from "../components/LogSelector";
import { JellyfishServer, ServerProps } from "./JellyfishServer";
import { useEffect, useState } from "react";
import { CloseButton } from "../components/CloseButton";
import { useAtom, atom } from "jotai";
import { Toaster } from "react-hot-toast";
import { atomWithStorage } from "jotai/utils";
import { TbArrowBack } from "react-icons/tb";
import { GiHamburgerMenu } from "react-icons/gi";
import { Checkbox } from "../components/Checkbox";
import SocialLinks, { DASHBOARD_GITHUB, SocialIcon } from "../components/SocialLinks";
import { socialIcons } from "../assets/SocialIcons";
import clsx from "clsx";

const selectDefaultHost = (host: string) => {
  const parts = host.split(":");
  return parts.length === 2 ? parts[0] : "localhost";
};

export const DEFAULT_PORT = "5002";
export const DEFAULT_IP = selectDefaultHost(window.location.host);
export const DEFAULT_HOST = `${DEFAULT_IP}:${DEFAULT_PORT}`;
export const DEFAULT_IS_WSS = false;
export const DEFAULT_IS_HTTPS = false;
export const DEFAULT_PATH = "/socket/peer/websocket";
export const DEFAULT_TOKEN = "development";

export const hostAtom = atom(DEFAULT_HOST);
export const isWssAtom = atom(DEFAULT_IS_WSS);
export const isHttpsAtom = atom(DEFAULT_IS_HTTPS);
export const pathAtom = atom(DEFAULT_PATH);
export const serverTokenAtom = atom(DEFAULT_TOKEN);
export const serversAtom = atomWithStorage<Record<string, ServerProps>>("previous-jellyfishes", {});

export const autoRefetchServerStateAtom = atomWithStorage<boolean>("Auto refetch server state", true);
export const autoRefetchActiveRoomAtom = atomWithStorage<boolean>("Auto refetch active room", true);

export const Dashboard = () => {
  const [host, setHost] = useAtom(hostAtom);
  const [isWss, setIsWss] = useAtom(isWssAtom);
  const [isHttps, setIsHttps] = useAtom(isHttpsAtom);
  const [path, setPath] = useAtom(pathAtom);
  const [serverToken, setServerToken] = useAtom(serverTokenAtom);

  const [autoRefetchServerState, setAutoRefetchServerState] = useAtom(autoRefetchServerStateAtom);
  const [autoRefetchActiveRoomState, setAutoRefetchActiveRoomState] = useAtom(autoRefetchActiveRoomAtom);

  const [activeHost, setActiveHost] = useState<string | null>(null);
  const [jellyfishServers, setJellyfishServers] = useAtom(serversAtom);

  useEffect(() => {
    const servers = Object.values(jellyfishServers);
    if ((activeHost === null || jellyfishServers[activeHost] === undefined) && servers.length > 0) {
      setActiveHost(servers[0].id);
    }
  }, [jellyfishServers, activeHost]);

  // remove old servers
  useEffect(() => {
    const copy = { ...jellyfishServers };
    Object.values(jellyfishServers)
      .filter((server) => !server.id || server.id.includes("   "))
      .forEach(({ host }) => {
        delete copy[host];
      });

    if (Object.values(copy).length !== Object.values(jellyfishServers).length) {
      setJellyfishServers(copy);
    }
  }, [jellyfishServers, setJellyfishServers]);

  const [refetchDemand, setRefetchDemand] = useState<boolean>(false);

  return (
    <div className="drawer">
      <Toaster />
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ml-3 flex flex-row justify-between">
        <div className="flex flex-row w-full">
          <label htmlFor="my-drawer" className="btn drawer-button mr-3">
            <GiHamburgerMenu size={24} />
          </label>
          {/*  Open drawer*/}
          {Object.keys(jellyfishServers).length === 0 ? (
            <div className="w-full h-screen items-center content-center flex flex-col gap-2">
              <h1 className=" text-5xl text-blue-400 align-middle mt-10">Boring, isn't it?</h1>
              <h2 className="text-3xl "> consider adding your first jellyfish server!</h2>
              <label htmlFor="my-drawer" className="btn drawer-button mt-5 bg-blue-400">
                Connect to server!
              </label>
            </div>
          ) : (
            <div className="flex flex-col justify-start p-1 gap-1">
              <div className="tabs tabs-boxed tabs-bordered tabs-lg gap-2 mt-5 flex flex-wrap" role="tablist">
                {Object.values(jellyfishServers).map((server) => (
                  <button
                    role="tab"
                    key={server.id}
                    className={clsx(
                      "indicator bg-gray-50 text-gray-500 hover:text-black tab",
                      server.id === activeHost && "tab-active",
                    )}
                    onClick={() => {
                      setActiveHost(server.id);
                    }}
                  >
                    <CloseButton
                      position="left"
                      onClick={() => {
                        setJellyfishServers((prev) => {
                          const copy = { ...prev };
                          delete copy[server.id];
                          return copy;
                        });
                      }}
                    />
                    {server.id}
                  </button>
                ))}
              </div>
              {Object.values(jellyfishServers).map((server) => (
                <JellyfishServer key={server.id} {...server} active={server.id === activeHost} />
              ))}
            </div>
          )}
        </div>
        <div className="p-2">
          <SocialIcon icon={socialIcons.github} href={DASHBOARD_GITHUB} />
        </div>
        {/* Page content here */}
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <div className="menu p-4 w-80 min-h-full h-fit bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <div className="flex flex-col justify-start items-center">
            <div className="flex flex-col justify-start items-stretch w-5/6 gap-2 ">
              <div className="flex flex-row justify-between w-full items-center">
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => {
                    setRefetchDemand(true);
                  }}
                >
                  Refetch all servers
                </button>
                <ThemeSelector />
              </div>
              <div
                data-tip="Jellyfish server token"
                className="form-control flex flex-row items-center tooltip tooltip-info tooltip-right w-full"
              >
                <input
                  type="text"
                  placeholder="Jellyfish server token"
                  className="input input-bordered w-full max-w-xs"
                  value={serverToken || ""}
                  onChange={(event) => {
                    setServerToken(event.target.value);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 w-full gap-2">
                <label
                  data-tip="Signaling protocol"
                  className="flex flex-row justify-start gap-1 label cursor-pointer form-control tooltip tooltip-info tooltip-top"
                >
                  <span className="label-text">ws</span>
                  <input type="checkbox" className="toggle" checked={isWss} onChange={() => setIsWss(!isWss)} />
                  <span className="label-text">wss</span>
                </label>
                <label
                  data-tip="API requests protocol"
                  className="flex flex-row justify-end gap-1 label cursor-pointer tooltip tooltip-info tooltip-top"
                >
                  <span className="label-text">http</span>
                  <input type="checkbox" className="toggle" checked={isHttps} onChange={() => setIsHttps(!isHttps)} />
                  <span className="label-text">https</span>
                </label>
              </div>
              <div
                data-tip="Jellyfish server"
                className="form-control tooltip tooltip-info tooltip-right flex flex-row items-center w-full"
              >
                <input
                  type="text"
                  placeholder="Jellyfish host"
                  className="input input-bordered w-full max-w-xs"
                  value={host || ""}
                  onChange={(event) => {
                    const value = event.target.value.trim();
                    if (value.startsWith("https://")) {
                      setIsHttps(true);
                      setIsWss(true);
                      setHost(value.replace("https://", ""));
                    } else if (value.startsWith("http://")) {
                      setIsHttps(false);
                      setIsWss(false);
                      setHost(value.replace("http://", ""));
                    } else {
                      setHost(value.trim());
                    }
                  }}
                />
              </div>

              <div
                data-tip="Signaling path"
                className="form-control tooltip tooltip-info tooltip-right flex flex-row items-center w-full"
              >
                <input
                  type="text"
                  placeholder="Signaling path"
                  className="input input-bordered w-full max-w-xs"
                  value={path || ""}
                  onChange={(event) => {
                    setPath(event.target.value.trim());
                  }}
                />
              </div>
              <div className="flex flex-row gap-1 justify-between">
                <button
                  className="btn btn-neutral btn-sm p-1 ml-1 tooltip tooltip-info tooltip-right"
                  data-tip="Restore default"
                  onClick={() => {
                    setServerToken(DEFAULT_TOKEN);
                    setHost(DEFAULT_HOST);
                    setPath(DEFAULT_PATH);
                    setIsWss(DEFAULT_IS_WSS);
                    setIsHttps(DEFAULT_IS_HTTPS);
                  }}
                >
                  <TbArrowBack size={"1.5em"} />
                </button>
                <button
                  disabled={!host || !path || !serverToken}
                  className="btn btn-sm btn-success w-3/4"
                  onClick={() => {
                    const id = `${isHttps ? "https" : "http"}://${host}${path}`;
                    setJellyfishServers((prev) => {
                      return {
                        ...prev,
                        [id]: {
                          id,
                          host,
                          isWss,
                          isHttps,
                          path,
                          serverToken,
                          refetchDemand,
                          active: activeHost === host,
                        },
                      };
                    });
                    setActiveHost(id);
                  }}
                >
                  Connect to server
                </button>
              </div>
            </div>
            <div className="flex justify-items-start w-5/6 flex-row">
              <div className="w-1/2">
                <PersistentExtras name={HLS_DISPLAY} />
              </div>
            </div>
            <div className="flex justify-items-start w-5/6 flex-row">
              <div className="w-1/2">
                <PersistentInput name={REFETCH_ON_SUCCESS} />
              </div>
              <div className="w-1/2">
                <PersistentInput name={REFETCH_ON_MOUNT} />
              </div>
            </div>
            <div className="flex justify-items-start w-5/6 flex-row">
              <div className="w-1/2">
                <Checkbox
                  value={autoRefetchServerState}
                  setValue={setAutoRefetchServerState}
                  name="Auto refetch server state"
                />
              </div>
              <div className="w-1/2">
                <Checkbox
                  value={autoRefetchActiveRoomState}
                  setValue={setAutoRefetchActiveRoomState}
                  name="Auto refetch active room"
                />
              </div>
            </div>

            <div className="flex w-full justify-evenly flex-row"></div>
            <LogSelector />
          </div>
          <SocialLinks orientation="row" />
        </div>
      </div>
    </div>
  );
};
