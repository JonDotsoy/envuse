import crypto, {
  randomBytes,
  randomFillSync,
  randomInt,
  createHmac,
  scrypt,
  createCipheriv,
  createDecipheriv,
} from "crypto";
import utils from "util";
import { pipeline, Readable, Writable } from "stream";

const algorithm = "aes-192-cbc" as const;

const writableToBuffer = (input: { buffer: Buffer }): Writable => {
  return new Writable({
    write(chunk: Buffer, _, cb) {
      input.buffer = Buffer.concat([input.buffer, chunk]);
      cb();
    },
    final(end) {
      end();
    },
  });
};

export class Key {
  private readonly keyLength = 24;
  private readonly vectorLength = 16;

  constructor(readonly key: Buffer, readonly salt: Buffer) {}

  async getScryptKey() {
    return new Promise<Buffer>((resolve, reject) => {
      scrypt(this.key, this.salt, this.keyLength, (err, key) => {
        if (err) {
          reject(err);
        }
        resolve(key);
      });
    });
  }

  getInitialVector() {
    return Buffer.alloc(this.vectorLength, 0);
  }

  saltToString(encoding: BufferEncoding = "base64url") {
    return this.salt.toString(encoding);
  }

  toString(encoding: BufferEncoding = "base64url") {
    return this.key.toString(encoding);
  }

  toJSON() {
    return this.toString();
  }

  async encrypt(plainVal: Buffer) {
    const key = await this.getScryptKey();
    const iv = this.getInitialVector();

    const cipher = createCipheriv(algorithm, key, iv);

    let res = { buffer: Buffer.alloc(0) };

    return await new Promise<Buffer>((resolve, reject) => {
      pipeline(Readable.from(plainVal), cipher, writableToBuffer(res), (err) =>
        err ? reject(err) : resolve(res.buffer)
      );
    });
  }

  async decrypt(cipherVal: Buffer) {
    const key = await this.getScryptKey();
    const iv = this.getInitialVector();

    const decipher = createDecipheriv(algorithm, key, iv);

    let res = { buffer: Buffer.alloc(0) };

    return await new Promise<Buffer>((resolve, reject) => {
      pipeline(
        Readable.from(cipherVal),
        decipher,
        writableToBuffer(res),
        (err) => (err ? reject(err) : resolve(res.buffer))
      );
    });
  }

  [utils.inspect.custom]: utils.CustomInspectFunction = () => this.toString();
}

const optionToBuffer = <T extends string | Buffer | number>(
  option: T
): Buffer =>
  typeof option === "string"
    ? Buffer.from(option, "base64")
    : option instanceof Buffer
    ? option
    : randomBytes(option);

export const createKey = <
  T extends string | Buffer | number,
  T2 extends string | Buffer | number
>(
  option: T,
  salt?: T2
) => new Key(optionToBuffer(option), optionToBuffer(salt ?? 30));
