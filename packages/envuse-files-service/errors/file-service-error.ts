export class FileServiceError extends TypeError {
  meta: any;

  constructor(message: string, meta?: any) {
    super(message);
    this.meta = meta;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.meta?.code,
      meta: this.meta,
    };
  }
}
