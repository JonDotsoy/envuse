import { NodeSchema } from "./node";
import z from "zod";

export const ValueTemplateSchema = z.object({});
export type ValueTemplate = z.TypeOf<typeof ValueTemplateSchema>;

export const VariableDeclarationSchema = z.object({
  type: z.string(),
  value_template: z.nullable(ValueTemplateSchema),
  _node: z.nullable(NodeSchema(z.any())),
});
export type VariableDeclaration = z.TypeOf<typeof VariableDeclarationSchema>;

export const EnvuseDeclarationSchema = z.object({
  variables: z.record(VariableDeclarationSchema),
});
export type EnvuseDeclaration = z.TypeOf<typeof EnvuseDeclarationSchema>;
