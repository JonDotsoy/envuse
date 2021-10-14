import { Readable, Writable } from "stream";
import { toMessage } from "./to-message";
import { Message } from "./types/message";

export class StreamMessages {
  constructor(
    private readonly stdin: Writable,
    private readonly stdout: Readable
  ) {}

  sendMessage(type: Message["$type"], message?: Message["$message"]) {
    this.stdin.write(JSON.stringify({ $type: type, $message: message }) + "\n");
  }

  subscribeMessage(
    type: Message["$type"],
    subscriber: (message?: Message["$message"]) => void
  ) {
    const listener = (data: Buffer) => {
      const message = toMessage(data);

      if (message && type === message.$type) {
        subscriber(message.$message);
      }
    };

    this.stdout.on("data", listener);

    return () => {
      this.stdout.off("data", listener);
    };
  }

  waitForMessage(type: Message["$type"]) {
    return new Promise<Message["$message"]>((resolve, _reject) => {
      const unsubscribe = this.subscribeMessage(type, (message) => {
        unsubscribe();
        resolve(message);
      });
    });
  }
}
