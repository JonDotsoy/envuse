import { URL } from "url";
import { useMockServerWorker } from "../libs/mock-server-worker/use-mock-server-worker";
import { loadDataSync } from "./load-sync";

describe("load sync", () => {
  jest.setTimeout(20_000);
  const { getUrlServer, srvWorker } = useMockServerWorker();

  beforeAll(() => {
    srvWorker.addUseRequest({
      headers: [["Content-Type", "application/envuse"]],
      method: "GET",
      path: "/1/file.envuse",
      statusCode: 200,
      body: "FOO=bar\nBAR=foo",
    });
  });

  it("should load sync", () => {
    const uri = new URL(`${getUrlServer()}/1/file.envuse`);

    const res = loadDataSync({ dsn: uri.href });

    expect(res).toHaveProperty("dsn");
    expect(res).toHaveProperty("data");
    expect(res.data).toBeInstanceOf(Buffer);
  });
});
