import { isAddressInfo } from "./is-address-info";
import { MockServerWorker } from "./mock-server-worker";
import { RequestMessage } from "./types/request-message";
import once from "lodash/once";

// Global SrcWorker
const srvWorker = new MockServerWorker();

const onceSrvWorkerListen = once(() => srvWorker.listen());

export function useMockServerWorker() {
  let urlServer: string;
  const callRequest = jest.fn((request: RequestMessage) => {});

  beforeEach(() => {
    callRequest.mockReset();
  });

  beforeAll(async () => {
    await onceSrvWorkerListen();

    srvWorker.subscribeRequests(callRequest);

    if (isAddressInfo(srvWorker.address)) {
      let hostname: string;

      switch (srvWorker.address.address) {
        case "0.0.0.0":
        case "::": {
          hostname = "localhost";
          break;
        }
        default: {
          hostname = srvWorker.address.address;
          break;
        }
      }

      urlServer = `http://${hostname}:${srvWorker.address.port}`;
    } else if (typeof srvWorker.address === "string") {
      urlServer = srvWorker.address;
    } else {
      throw new Error("srvWorker.address is not AddressInfo or string");
    }
  });

  afterAll(async () => {
    await srvWorker.close();
  });

  const getUrlServer = () => urlServer;

  return { srvWorker, getUrlServer, callRequest };
}
