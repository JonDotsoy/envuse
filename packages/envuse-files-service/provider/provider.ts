export abstract class Provider {
  abstract typeName: string;

  abstract idToPath(id: string): string;

  abstract writeFile(filePath: string, body: Buffer): Promise<void>;
  abstract deleteFile(filePath: string): Promise<void>;
  abstract readFile(filePath: string): Promise<Buffer | null>;
}
