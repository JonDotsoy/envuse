import { isAddressInfo } from "./is-address-info";
import { MockServerWorker } from "./mock-server-worker";
import { RequestMessage } from "./types/request-message";

export function useMockServerWorker() {
  let urlServer: string;
  const srvWorker = new MockServerWorker();
  const callRequest = jest.fn((request: RequestMessage) => {});
  let unsubscribeRequest: (() => void) | undefined;

  beforeEach(() => {
    callRequest.mockReset();
  });

  beforeAll(async () => {
    await srvWorker.listen();

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
    unsubscribeRequest?.();
    await srvWorker.close();
  });

  const getUrlServer = () => urlServer;

  return { srvWorker, getUrlServer, callRequest };
}
