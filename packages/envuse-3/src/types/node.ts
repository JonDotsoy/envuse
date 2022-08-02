import z from "zod";

export const RangeSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export const PointSchema = z.object({
  line: z.number(),
  column: z.number(),
});

export const SpanSchema = z.object({
  start: PointSchema,
  end: PointSchema,
  range: RangeSchema,
});

export const TokenSchema = z.object({
  span: SpanSchema,
});

export const NodeSchema = <T extends z.Schema>(t: T) =>
  z.tuple([TokenSchema, t]);

export const LiteralSchema = z.object({ Literal: z.string() });

export const InlineCommentSchema = z.object({
  InlineComment: z.object({
    ident_number: NodeSchema(LiteralSchema),
    comment: NodeSchema(LiteralSchema),
  }),
});

export const VariableNameSchema = z.object({
  VariableName: z.object({
    name: z.string(),
  }),
});

export const VariableTypeSchema = z.object({
  VariableType: z.object({
    variable_type: NodeSchema(VariableNameSchema),
  }),
});

export const VariableLinkSchema = z.object({
  VariableType: z.object({
    variable: NodeSchema(VariableNameSchema),
    options: z.array(NodeSchema(VariableNameSchema)),
  }),
});

export const VariableTemplateSchema = z.object({
  VariableTemplate: z.object({
    template: z.array(NodeSchema(z.union([LiteralSchema, VariableLinkSchema]))),
  }),
});

export const VariableSchema = z.object({
  Variable: z.object({
    variable_name: NodeSchema(VariableNameSchema),
    variable_type: z.nullable(NodeSchema(VariableTypeSchema)),
    variable_value: z.nullable(NodeSchema(VariableTemplateSchema)),
  }),
});

export const DocumentSchema = z.object({
  Document: z.object({
    nodes: z.array(NodeSchema(z.union([InlineCommentSchema, VariableSchema]))),
  }),
});

export const NodeDocumentSchema = NodeSchema(DocumentSchema);

export type Range = z.infer<typeof RangeSchema>;
export type Point = z.infer<typeof PointSchema>;
export type Span = z.infer<typeof SpanSchema>;
export type Token = z.infer<typeof TokenSchema>;
// prettier-ignore
export type Node<T extends z.Schema> = z.infer<
  ReturnType<
    typeof NodeSchema
  >
>;
export type Literal = z.infer<typeof LiteralSchema>;
export type InlineComment = z.infer<typeof InlineCommentSchema>;
export type VariableName = z.infer<typeof VariableNameSchema>;
export type VariableType = z.infer<typeof VariableTypeSchema>;
export type VariableLink = z.infer<typeof VariableLinkSchema>;
export type VariableTemplate = z.infer<typeof VariableTemplateSchema>;
export type Variable = z.infer<typeof VariableSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type NodeDocument = z.infer<typeof NodeDocumentSchema>;
