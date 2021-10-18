import { Provider } from "./provider";
import path from "path";
import fs from "fs/promises";
import { cwd } from "process";

interface LocalFileSystemProviderOptions {
  baseDirStore?: string;
}

export class LocalFileSystemProvider extends Provider {
  typeName = "LocalFileSystem" as const;
  private readonly baseDirStore: string;

  constructor(options?: LocalFileSystemProviderOptions) {
    super();
    this.baseDirStore =
      options?.baseDirStore ?? path.normalize(`${cwd()}/store/files`);
  }

  idToPath(id: string): string {
    return path.normalize(`${this.baseDirStore}/${id}.json`);
  }

  async writeFile(filePath: string, body: Buffer) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, body, { mode: 0o600 });
  }

  async readFile(filePath: string) {
    const stat = await fs.stat(filePath);

    if (!stat.isFile()) {
      return null;
    }

    return await fs.readFile(filePath);
  }

  async deleteFile(filePath: string) {
    await fs.unlink(filePath);
  }
}
