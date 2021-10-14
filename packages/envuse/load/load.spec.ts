import { URL } from "url";
import { load } from "./load";
import fs from "fs";
import path from "path";
import url from "url";
import { useMockServerWorker } from "../libs/mock-server-worker/use-mock-server-worker";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

describe("Load", () => {
  describe("load DSN http", () => {
    const { srvWorker, getUrlServer, callRequest } = useMockServerWorker();

    it("should load DSN http", async () => {
      srvWorker.addUseRequest({
        method: "GET",
        statusCode: 200,
        headers: [["Content-Type", "application/envuse"]],
        path: "/1/file.envuse",
        body: ["FOO=bar", "BAR:number=6070"].join("\n"),
      });

      const uri = new URL(`${getUrlServer()}/1/file.envuse`);

      const res = await load({ dsn: uri.href });

      expect(res).toHaveProperty("dsn");
      expect(res).toHaveProperty("definitions");
      expect(res).toHaveProperty("parsed");
      expect(res).toHaveProperty("ast");

      expect(res.definitions.FOO?.value).toEqual("bar");
      expect(res.definitions.BAR?.value).toEqual(6070);
    });

    it("should load DSN http with authorization", async () => {
      srvWorker.addUseRequest({
        method: "GET",
        statusCode: 200,
        headers: [
          ["Content-Type", "application/envuse"],
          ["Authorization", `Basic dXNlcjpwYXNz`],
        ],
        path: "/2/file.envuse",
        body: ["FOO=bar", "BAR:number=6070"].join("\n"),
      });

      const uri = new URL(`${getUrlServer()}/2/file.envuse`);

      uri.username = "user";
      uri.password = "pass";

      await load({ dsn: uri.href });

      const hAuthorization =
        callRequest.mock.calls?.[0]?.[0]?.headers?.authorization;

      expect(hAuthorization).toMatchInlineSnapshot(`"Basic dXNlcjpwYXNz"`);

      const [user, pass] = Buffer.from(hAuthorization!.split(" ")[1], "base64")
        .toString()
        .split(":");

      expect(user).toEqual("user");
      expect(pass).toEqual("pass");
    });
  });

  describe("load DSN fileUrl", () => {
    let filepath = useTempFilepath(() =>
      Buffer.concat([
        Buffer.from("FOO=bar\n"),
        Buffer.from("BAR:number=6070\n"),
      ])
    );

    it("should load DSN file url", async () => {
      const res = await load({ dsn: url.pathToFileURL(filepath).href });

      expect(res).toHaveProperty("dsn");
      expect(res).toHaveProperty("definitions");
      expect(res).toHaveProperty("parsed");
      expect(res).toHaveProperty("ast");
    });
  });

  describe("load DSN filepath", () => {
    let filepath = useTempFilepath(() =>
      Buffer.concat([
        Buffer.from("FOO=bar\n"),
        Buffer.from("BAR:number=6070\n"),
      ])
    );

    it("should load DSN file path", async () => {
      const res = await load({ dsn: filepath });

      expect(res).toHaveProperty("dsn");
      expect(res).toHaveProperty("definitions");
      expect(res).toHaveProperty("parsed");
      expect(res).toHaveProperty("ast");
    });
  });
});

function useTempFilepath(
  getBuff: (filepath: string) => Buffer | Promise<Buffer>
) {
  let filepath = `${tmpdir()}/${randomUUID()}/.envuse`;

  beforeAll(async () => {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, await getBuff(filepath));
  });

  afterAll(() => {
    fs.unlinkSync(filepath);
  });
  return filepath;
}
