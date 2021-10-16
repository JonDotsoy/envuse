import { ChildProcess, spawn } from "child_process";
import path from "path";
import { AddressInfo } from "net";
import { Message } from "./types/message";
import { StreamMessages } from "./stream-messages";
import { RequestMessage } from "./types/request-message";

export class MockServerWorker {
  childProcess?: ChildProcess;
  address?: string | AddressInfo;
  streamMessages?: StreamMessages;

  private sendMessage(type: string, message?: any) {
    if (!this.streamMessages) throw new Error("No streamMessages");
    this.streamMessages.sendMessage(type, message);
  }

  private subscribeMessage(
    type: Message["$type"],
    cb: (message: Message["$message"]) => void
  ) {
    if (!this.streamMessages) throw new Error("No streamMessages");
    return this.streamMessages.subscribeMessage(type, cb);
  }

  private waitForMessage(type: string) {
    if (!this.streamMessages) throw new Error("No streamMessages");
    return this.streamMessages.waitForMessage(type);
  }

  addUseRequest(opts: {
    method: "GET" | "POST" | "PUT";
    path: string;
    statusCode: number;
    headers: [string, string][];
    body: string;
  }) {
    this.sendMessage("useRequest", opts);
  }

  subscribeRequests(cb: (request: RequestMessage) => void) {
    return this.subscribeMessage("handler_request", (message) => {
      cb(message);
    });
  }

  async close() {
    this.sendMessage("close_server");
    await this.waitForMessage("server_closed");
  }

  async listen() {
    const isTs = path.extname(__filename) === ".ts";

    const childProcess = spawn(
      isTs ? "ts-node" : "node",
      [
        isTs
          ? `${__dirname}/server-demo-host.ts`
          : `${__dirname}/server-demo-host.js`,
      ],
      {
        stdio: "pipe",
      }
    );

    this.childProcess = childProcess;

    this.streamMessages = new StreamMessages(
      childProcess.stdin,
      childProcess.stdout
    );

    await this.waitForMessage("worker_ready");

    this.sendMessage("action", { type: "listen" });

    const msg = await this.waitForMessage("listen_success");

    this.address = msg.address;
  }
}
