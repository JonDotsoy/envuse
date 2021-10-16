import { createServer, RequestListener } from "http";
import { StreamMessages } from "./stream-messages";
import { RequestMessage } from "./types/request-message";

const infiniteLoop = setInterval(() => {}, 10_000);

const streamMessages = new StreamMessages(process.stdout, process.stdin);

const listenRequests: {
  method: string;
  path: string;
  statusCode: number;
  headers: [string, string][];
  body: string;
}[] = [];

const listener: RequestListener = (req, res) => {
  streamMessages.sendMessage("handler_request", <RequestMessage>{
    method: req.method,
    path: req.url,
    headers: req.headers,
  });

  const listenRequest = listenRequests.find(
    (r) => r.method === req.method && r.path === req.url
  );

  if (listenRequest) {
    listenRequest.headers.forEach(([name, value]) =>
      res.setHeader(name, value)
    );
    res.statusCode = listenRequest.statusCode;
    res.write(listenRequest.body);
    res.end();
    return;
  }

  res.statusCode = 404;
  res.write("Not Found");
  res.end();
};

const server = createServer(listener);

streamMessages.sendMessage("worker_ready");

streamMessages.subscribeMessage("action", (message) => {
  const type: string =
    typeof message === "object" && typeof message.type === "string"
      ? message.type
      : null;

  switch (type) {
    case "listen": {
      server.listen(() => {
        streamMessages.sendMessage("listen_success", {
          address: server.address(),
        });
      });
    }
  }
});

streamMessages.subscribeMessage("close_server", () => {
  server.close(() => {
    streamMessages.sendMessage("server_closed");
    clearInterval(infiniteLoop);
  });
});

streamMessages.subscribeMessage("useRequest", (msg) => {
  listenRequests.push(msg);
});
