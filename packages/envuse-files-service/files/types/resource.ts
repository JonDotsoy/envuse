import { ResourceId } from "./resource-id.type";

export interface Resource {
  id: ResourceId;
  salt: Buffer;
  body: Buffer;
  contentType: string;
}
