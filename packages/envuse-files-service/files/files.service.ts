import crypto from "crypto";
import { createKey } from "./util/create-key";
import { Provider } from "../provider/provider";
import { LocalFileSystemProvider } from "../provider/local-file-system.provider";
import { validateObjectResource } from "./validation/validate-object-resource";
import { Resource } from "./types/resource";
import { FileServiceError } from "../errors/file-service-error";

interface FilesServiceOptions {
  fileSystemProvider?: Provider;
}

export class FilesService {
  fileSystemProvider: Provider;

  constructor(options?: FilesServiceOptions) {
    this.fileSystemProvider =
      options?.fileSystemProvider ?? new LocalFileSystemProvider();
  }

  async readResource(resourcePath: string) {
    const body = await this.fileSystemProvider.readFile(resourcePath);

    if (!body) return null;

    let bodyParsed;
    try {
      bodyParsed = JSON.parse(body.toString("utf-8"));
    } catch (ex) {
      throw new FileServiceError(`Error parse file`, {
        resourcePath: resourcePath,
      });
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

  async writeResource(resourcePath: string, resource: Resource) {
    await this.fileSystemProvider.writeFile(
      resourcePath,
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

  async deleteResource(resourceId: string) {
    const resourcePath = this.fileSystemProvider.idToPath(resourceId);
    await this.fileSystemProvider.deleteFile(resourcePath);
  }

  async createResource(body: Buffer, contentType: string) {
    const id = crypto.randomUUID();
    const resourcePath = this.fileSystemProvider.idToPath(id);
    const key = createKey(60);

    const resource: Resource = {
      id,
      salt: key.salt,
      body: await key.encrypt(body),
      contentType,
    };

    this.writeResource(resourcePath, resource);

    return {
      id,
      key,
    };
  }

  async getResource(resourceId: string, key: string) {
    const resourcePath = this.fileSystemProvider.idToPath(resourceId);
    const resource = await this.readResource(resourcePath);

    if (!resource) return null;

    const k = createKey(key, resource.salt);

    return {
      id: resource.id,
      contentType: resource.contentType,
      body: await k.decrypt(resource.body),
    };
  }

  async updateResource(resourceId: string, body: Buffer, contentType: string) {
    const resourcePath = this.fileSystemProvider.idToPath(resourceId);
    const resource = await this.readResource(resourcePath);
    if (!resource) return null;

    const nextResource: Resource = {
      ...resource,
      body,
      contentType,
    };

    const filePath = this.fileSystemProvider.idToPath(resourceId);
    await this.writeResource(filePath, nextResource);

    return nextResource;
  }
}
