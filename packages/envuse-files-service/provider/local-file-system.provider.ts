import { Provider } from "./provider";
import path from "path";
import fs from "fs/promises";
import { cwd } from "process";
import { ResourceId } from "../files/types/resource-id.type";
import { ResourcePath } from "../files/types/resource-path.type";

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

  idToPath(id: ResourcePath | ResourceId) {
    if (id instanceof ResourcePath) return id;
    return ResourcePath.from(
      path.normalize(`${this.baseDirStore}/${id.resourceId}.json`)
    );
  }

  async writeFile(resourcePath: ResourcePath, body: Buffer) {
    await fs.mkdir(path.dirname(resourcePath.resourcePath), {
      recursive: true,
    });
    await fs.writeFile(resourcePath.resourcePath, body, { mode: 0o600 });
  }

  async readFile(resourcePath: ResourcePath) {
    const stat = await fs.stat(resourcePath.resourcePath);

    if (!stat.isFile()) {
      return null;
    }

    return await fs.readFile(resourcePath.resourcePath);
  }

  async deleteFile(resourcePath: ResourcePath) {
    await fs.unlink(resourcePath.resourcePath);
  }
}
