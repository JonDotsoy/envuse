import { DataSource } from "../../data-source";
import { diff } from "./diff";
import { b } from "./to-buffer";

describe("diff", () => {
  it("should diff deleted", () => {
    const block1 = DataSource.createDataSource(
      Buffer.concat([
        b("foo=bar\n"),
        b("aaa=bbb\n"),
        b("ccc=ddd\n"),
        b("hhh=iii\n"),
      ])
    );

    const block2 = DataSource.createDataSource(
      Buffer.concat([
        b("foo=bar\n"),
        b("aaa=bbb\n"),
        b("eee=fff\n"),
        b("hhh=jjj\n"),
      ])
    );

    expect(diff(block1, block2)).toMatchSnapshot();
  });
});
