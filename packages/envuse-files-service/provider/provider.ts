import { ResourceId } from "../files/types/resource-id.type";
import { ResourcePath } from "../files/types/resource-path.type";

export abstract class Provider {
  abstract typeName: string;

  abstract idToPath(id: ResourcePath | ResourceId): ResourcePath;

  abstract writeFile(resourcePath: ResourcePath, body: Buffer): Promise<void>;
  abstract deleteFile(resourcePath: ResourcePath): Promise<void>;
  abstract readFile(resourcePath: ResourcePath): Promise<Buffer | null>;
}
