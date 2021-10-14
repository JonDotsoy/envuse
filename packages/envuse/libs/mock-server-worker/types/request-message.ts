export interface RequestMessage {
  method: string;
  path: string;
  headers: { [key: string]: string };
}
