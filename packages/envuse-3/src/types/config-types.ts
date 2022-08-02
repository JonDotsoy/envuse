import { z, TypeOf } from "zod";
import { EnvuseDeclarationSchema } from "./envuse-declaration";

export const ConfigTypesSchema = z.object({
  configTypes: z.record(EnvuseDeclarationSchema),
});
export type ConfigTypes = TypeOf<typeof ConfigTypesSchema>;
