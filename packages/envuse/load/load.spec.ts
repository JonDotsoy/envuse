import { createServer, Server, RequestListener } from "http";
import { AddressInfo } from "net";
import { URL } from "url";
import { promisify } from "util";
import { load } from "./load";
import fs from "fs";

jest.mock("fs");

const isAddressInfo = (val: any): val is AddressInfo =>
  typeof val === "object" && val !== null && "port" in val;

describe("Load", () => {
  describe("load DSN http", () => {
    const writeRes = jest.fn((): string[] => []);
    const headerAuthorization = jest.fn((headerAuthorization?: string) => {});
    let server: Server;
    let urlServer: string;

    beforeEach(() => {
      writeRes.mockReset();
      headerAuthorization.mockReset();
    });

    beforeAll(async () => {
      const listener: RequestListener = (req, res) => {
        headerAuthorization(req.headers.authorization);
        if (req.url === "/file.envuse") {
          res.writeHead(200, {
            "Content-Type": "application/envuse; encode=UTF-8",
          });

          writeRes().map((r) => res.write(`${r}\n`));
          res.end();

          return;
        }

        res.statusCode = 404;
        res.write("Not Found");
        res.end();
      };

      server = createServer(listener);

      await promisify((cb) => {
        server.listen(() => {
          const address = server.address();

          if (isAddressInfo(address)) {
            urlServer = `http://localhost:${address.port}`;
          } else if (typeof address === "string") {
            urlServer = `http://${address}`;
          } else {
            throw new Error("Invalid address");
          }

          cb(null, null);
        });
      })();
    });

    afterAll(async () => {
      await promisify((cb) => {
        server.close((err) => cb(err ?? null, null));
      })();
    });

    it("should load DSN http", async () => {
      writeRes.mockReturnValue(["FOO=bar", "BAR:number=6070"]);

      const uri = new URL(`${urlServer}/file.envuse`);

      const res = await load({ dsn: uri.href });

      expect(res).toHaveProperty("dsn");
      expect(res).toHaveProperty("definitions");
      expect(res).toHaveProperty("parsed");
      expect(res).toHaveProperty("ast");

      expect(res.definitions.FOO.value).toEqual("bar");
      expect(res.definitions.BAR.value).toEqual(6070);
    });

    it("should load DSN http with authorization", async () => {
      writeRes.mockReturnValue(["FOO=bar", "BAR:number=6070"]);

      const uri = new URL(`${urlServer}/file.envuse`);

      uri.username = "user";
      uri.password = "pass";

      await load({ dsn: uri.href });

      const hAuthorization = headerAuthorization.mock.calls[0][0];

      expect(hAuthorization).toMatchInlineSnapshot(`"Basic dXNlcjpwYXNz"`);

      const [user, pass] = Buffer.from(hAuthorization!.split(" ")[1], "base64")
        .toString()
        .split(":");

      expect(user).toEqual("user");
      expect(pass).toEqual("pass");
    });
  });

  describe("load DSN fileUrl", () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });
    beforeAll(() => {
      jest.spyOn(fs, "readFile").mockImplementation((path, cb) => {
        if (path instanceof URL) {
          if (path.pathname === "/a/b/.envuse") {
            cb(
              null,
              Buffer.concat([
                Buffer.from("FOO=bar\n"),
                Buffer.from("BAR:number=6070\n"),
              ])
            );
          }
        }
        throw new Error("Invalid path");
      });
    });

    it("should load DSN file url", async () => {
      const res = await load({ dsn: "file:///a/b/.envuse" });

      expect(res).toHaveProperty("dsn");
      expect(res).toHaveProperty("definitions");
      expect(res).toHaveProperty("parsed");
      expect(res).toHaveProperty("ast");
    });
  });

  describe("load DSN filepath", () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });
    beforeAll(() => {
      jest.spyOn(fs, "existsSync").mockImplementation((path) => {
        if (path === "/a/b/.envuse") {
          return true;
        }
        throw new Error("Invalid path");
      });

      jest.spyOn(fs, "statSync").mockImplementation((path) => {
        if (path === "/a/b/.envuse") {
          return {
            isFile: () => true,
          } as fs.Stats;
        }
        throw new Error("Invalid path");
      });

      jest.spyOn(fs, "readFile").mockImplementation((path, cb) => {
        if (typeof path === "string") {
          if (path === "/a/b/.envuse") {
            cb(
              null,
              Buffer.concat([
                Buffer.from("FOO=bar\n"),
                Buffer.from("BAR:number=6070\n"),
              ])
            );
          }
        }
      });
    });

    it("should load DSN file path", async () => {
      const res = await load({ dsn: "/a/b/.envuse" });

      expect(res).toHaveProperty("dsn");
      expect(res).toHaveProperty("definitions");
      expect(res).toHaveProperty("parsed");
      expect(res).toHaveProperty("ast");
    });
  });
});
