export class ResourceId {
  constructor(public readonly resourceId: string) {}

  toString() {
    return this.resourceId;
  }

  toJSON() {
    return this.resourceId;
  }

  static from(resourceId: string) {
    return new ResourceId(resourceId);
  }
}
