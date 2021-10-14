export interface LoadOptions {
  /**
   * @example
   * `./.envuse`
   * @example
   * `https://Dc6RHsGaGdfCtA:3kkvgDtuELeg5ztBewlTAdeH@envuse.jon.soy/87e10b76-4200-4e67-8d2e-4715a695cf06`
   * @example
   * `https://sample.host/my_configs/my_envuse.envuse`
   */
  dsn: string;
  ignoreTypeValidation?: boolean;
  dsnHttpHeaders?: {
    [key: string]: string;
  };
  cache?: {
    enable?: boolean;
    filePath?: string;
    ttl?: number;
  };
}

export function assertsLoadOptions(v: any): asserts v is LoadOptions {
  if (typeof v !== "object") {
    throw new Error(`Expected object, got ${typeof v}`);
  }
  if (typeof v.dsn !== "string") {
    throw new Error(`Expected string, got ${typeof v.dsn}`);
  }
  if (
    typeof v.ignoreTypeValidation !== "undefined" &&
    typeof v.ignoreTypeValidation !== "boolean"
  ) {
    throw new Error(`Expected boolean, got ${typeof v.ignoreTypeValidation}`);
  }
  if (
    typeof v.dsnHttpHeaders !== "undefined" &&
    typeof v.dsnHttpHeaders !== "object"
  ) {
    throw new Error(`Expected object, got ${typeof v.dsnHttpHeaders}`);
  }
}
