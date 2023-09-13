import { useEffect, useState } from "react";

import InternalsSection from "./InternalsSection";
import parseIncomingStats, { Section, isChannelInput } from "./ParseIncomingStats";
import { ServerMessage } from "../protos/jellyfish/server_notifications";
import { useParams, useLocation } from "react-router-dom";

const createUrl = ({
  isSecure,
  host,
  socketAddress,
}: {
  isSecure: boolean;
  host: string | undefined;
  socketAddress: string | null;
}) => `ws${isSecure ? "s" : ""}://${host}/${socketAddress}`;

const wsConnect = (
  isSecure: boolean,
  host: string,
  socketAddress: string,
  token: string,
  setWs: (ws: WebSocket) => void,
) => {
  const internalsWebSocket = new WebSocket(createUrl({ isSecure, host, socketAddress }));

  if (internalsWebSocket) {
    internalsWebSocket.binaryType = "arraybuffer";
    const auth = ServerMessage.encode({ authRequest: { token: token } }).finish();
    const metricsSubscribe = ServerMessage.encode({ subscribeRequest: { eventType: 2 } }).finish();
    internalsWebSocket.addEventListener("open", () => {
      internalsWebSocket.send(auth);
      internalsWebSocket.send(metricsSubscribe);
    });
    setWs(internalsWebSocket);
  }
};

export const WebrtcInternalsPage = () => {
  const { host } = useParams();
  const query = new URLSearchParams(useLocation().search);

  const [chartData, setChartData] = useState<Section>({ descriptive: [], sdpInfo: [], charts: [], key: "main" });

  document.getElementsByTagName("html")?.[0].setAttribute("data-theme", "light");

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isSecure, setIsSecure] = useState<boolean>(query.get("secure") === "true");
  const [socketAddress, setSocketAddress] = useState<string>(query.get("socket") || "/socket/server/websocket");
  const [token, setToken] = useState<string>(query.get("token") || "development");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (event: any) => {
    const uint8array = new Uint8Array(event.data);
    try {
      const unpacked = ServerMessage.decode(uint8array);
      if (unpacked.metricsReport === undefined) {
        return;
      }
      if (unpacked.metricsReport.metrics === undefined) return;
      const val = JSON.parse(unpacked.metricsReport?.metrics || "");
      if (isChannelInput(val)) {
        setChartData((prevStats) => parseIncomingStats(val, prevStats, "main"));
      }
    } catch (e) {
      console.log("recieved invalid data");
      console.log(e);
      console.log(uint8array);
    }
  };

  //todo dodać input w przypadku braku danych

  useEffect(() => {
    if (!ws) return;
    ws?.addEventListener("message", handler);

    return () => {
      ws?.removeEventListener("message", handler);
    };
  }, [ws]);

  return (
    <div className="flex flex-col items-start w-full gap-1 p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="flex flex-1 card-body p-4 ">
          <div className="card-title">Initialize websocket connection:</div>
          <div className="flex flex-row gap-2 items-center">
            <h1>Secure websocket:</h1>
            <input type="checkbox" checked={isSecure} className="checkbox" onChange={() => setIsSecure(!isSecure)} />
            <h1>Socket address:</h1>
            <input
              type="text"
              placeholder={socketAddress}
              className="input w-full max-w-xs"
              onChange={(e) => setSocketAddress(e.target.value)}
            />
            <h1>Authorization token:</h1>
            <input
              type="text"
              placeholder={token}
              className="input w-full max-w-xs"
              onChange={(e) => setToken(e.target.value)}
            />
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                wsConnect(isSecure, host || "", socketAddress, token, setWs);
                setChartData({ descriptive: [], sdpInfo: [], charts: [], key: "main" });
              }}
            >
              Confirm settings
            </button>
          </div>
        </div>
      </div>
      {ws && (
        <div className="card bg-base-100 shadow-xl">
          <div className="flex flex-1 card-body p-4 ">
            <InternalsSection title="main" section={chartData} />
          </div>
        </div>
      )}
    </div>
  );
};
