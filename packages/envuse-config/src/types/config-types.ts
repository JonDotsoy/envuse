import z from "zod";
import { EnvuseDeclarationSchema } from "./envuse-declaration";

export const ConfigTypesSchema = z.object({
  configTypes: z.record(EnvuseDeclarationSchema),
});
export type ConfigTypes = z.infer<typeof ConfigTypesSchema>;
