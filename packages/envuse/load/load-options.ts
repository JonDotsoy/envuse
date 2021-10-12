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
}
