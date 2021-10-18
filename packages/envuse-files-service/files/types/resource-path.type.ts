export class ResourcePath {
  constructor(public readonly resourcePath: string) {}

  toString() {
    return this.resourcePath;
  }

  toJSON() {
    return this.resourcePath;
  }

  static from(resourcePath: string) {
    return new ResourcePath(resourcePath);
  }
}
