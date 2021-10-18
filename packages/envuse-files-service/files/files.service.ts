import crypto from "crypto";
import { createKey } from "./util/create-key";
import { Provider } from "../provider/provider";
import { LocalFileSystemProvider } from "../provider/local-file-system.provider";
import { validateObjectResource } from "./validation/validate-object-resource";
import { Resource } from "./types/resource";

interface FilesServiceOptions {
  fileSystemProvider?: Provider;
}

export class FilesService {
  fileSystemProvider: Provider;

  constructor(options?: FilesServiceOptions) {
    this.fileSystemProvider =
      options?.fileSystemProvider ?? new LocalFileSystemProvider();
  }

  async readResource(filePath: string) {
    const body = await this.fileSystemProvider.readFile(filePath);

    if (!body) return null;

    let bodyParsed;
    try {
      bodyParsed = JSON.parse(body.toString("utf-8"));
    } catch (ex) {
      throw new Error(`Error found`);
    }

    validateObjectResource(bodyParsed);

    const resource: Resource = {
      id: bodyParsed.id,
      salt: Buffer.from(bodyParsed.salt, "base64"),
      body: Buffer.from(bodyParsed.body, "base64"),
      contentType: bodyParsed.contentType,
    };

    return resource;
  }

  async writeResource(filePath: string, resource: Resource) {
    await this.fileSystemProvider.writeFile(
      filePath,
      Buffer.from(
        JSON.stringify({
          id: resource.id,
          salt: resource.salt.toString("base64"),
          body: resource.body.toString("base64"),
          contentType: resource.contentType,
        })
      )
    );
  }

  async deleteResource(filePath: string) {
    await this.fileSystemProvider.deleteFile(filePath);
  }

  async createResource(body: Buffer, contentType: string) {
    const id = crypto.randomUUID();
    const storeFilePath = this.fileSystemProvider.idToPath(id);
    const key = createKey(60);

    const resource: Resource = {
      id,
      salt: key.salt,
      body: await key.encrypt(body),
      contentType,
    };

    this.writeResource(storeFilePath, resource);

    return {
      id,
      key,
    };
  }

  async getResource(id: string, key: string) {
    const resourceFilePath = this.fileSystemProvider.idToPath(id);
    const resource = await this.readResource(resourceFilePath);

    if (!resource) return null;

    const k = createKey(key, resource.salt);

    return {
      id: resource.id,
      contentType: resource.contentType,
      body: await k.decrypt(resource.body),
    };
  }

  async updateResource(id: string, body: Buffer, contentType: string) {
    const resourceFilePath = this.fileSystemProvider.idToPath(id);
    const resource = await this.readResource(resourceFilePath);
    if (!resource) return null;

    const nextResource: Resource = {
      ...resource,
      body,
      contentType,
    };

    const filePath = this.fileSystemProvider.idToPath(id);
    await this.writeResource(filePath, nextResource);

    return nextResource;
  }
}
