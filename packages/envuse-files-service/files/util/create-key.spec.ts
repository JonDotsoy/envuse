import { createKey } from "./create-key";
import crypto from "crypto";

describe("crate key", () => {
  it("sample key", () => {
    const key = createKey(60).toString();

    expect(key).toBeDefined();
    expect(typeof key).toEqual("string");
  });

  it("encrypt", async () => {
    const keyString = "123";
    const saltString = "ABC";
    const keyA = createKey(keyString, saltString);
    const keyB = createKey(keyString, saltString);

    const input = Array(100)
      .fill(0)
      .map((_, i) => i)
      .join(",");

    const encrypted = await keyA.encrypt(Buffer.from(input));
    const decrypted = await keyB.decrypt(encrypted);

    // console.log(re.toString('base64'));
    // console.log(res.toString('utf-8'));
    expect(decrypted.toString()).toEqual(input);
  });
});
