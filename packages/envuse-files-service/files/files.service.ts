import crypto from "crypto";
import { createKey } from "./util/create-key";
import { Provider } from "../provider/provider";
import { LocalFileSystemProvider } from "../provider/local-file-system.provider";
import { validateObjectResource } from "./validation/validate-object-resource";
import { Resource } from "./types/resource";
import { FileServiceError } from "../errors/file-service-error";
import { ResourceId } from "./types/resource-id.type";
import { ResourcePath } from "./types/resource-path.type";

interface FilesServiceOptions {
  fileSystemProvider?: Provider;
}

export class FilesService {
  fileSystemProvider: Provider;

  constructor(options?: FilesServiceOptions) {
    this.fileSystemProvider =
      options?.fileSystemProvider ?? new LocalFileSystemProvider();
  }

  async readResource(resourcePath: ResourcePath) {
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
      id: ResourceId.from(bodyParsed.id),
      salt: Buffer.from(bodyParsed.salt, "base64"),
      body: Buffer.from(bodyParsed.body, "base64"),
      contentType: bodyParsed.contentType,
    };

    return resource;
  }

  async writeResource(resourcePath: ResourcePath, resource: Resource) {
    await this.fileSystemProvider.writeFile(
      resourcePath,
      Buffer.from(
        JSON.stringify({
          id: resource.id.resourceId,
          salt: resource.salt.toString("base64"),
          body: resource.body.toString("base64"),
          contentType: resource.contentType,
        })
      )
    );
  }

  async deleteResource(resourceId: ResourcePath | ResourceId) {
    const resourcePath = this.fileSystemProvider.idToPath(resourceId);
    await this.fileSystemProvider.deleteFile(resourcePath);
  }

  async createResource(body: Buffer, contentType: string) {
    const id = ResourceId.from(crypto.randomUUID());
    const resourcePath = this.fileSystemProvider.idToPath(id);
    const key = createKey(60);

    const resource: Resource = {
      id: id,
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

  async getResource(resourceId: ResourcePath | ResourceId, key: string) {
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

  async updateResource(
    resourceId: ResourcePath | ResourceId,
    body: Buffer,
    contentType: string
  ) {
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
