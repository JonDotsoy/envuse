export interface Resource {
  id: string;
  salt: Buffer;
  body: Buffer;
  contentType: string;
}
