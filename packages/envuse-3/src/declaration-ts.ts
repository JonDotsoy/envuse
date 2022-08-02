import { FieldTSD, StructTSD, SymbolTSD, TSD } from "./TSD";
import { EnvuseDeclaration } from "./types/envuse-declaration";

const map_ts_types: Record<string, string> = {
  string: "string",
  number: "number",
  boolean: "boolean",
  array: "string[]",
};

export const describeDeclarationTs = (declaration: EnvuseDeclaration): TSD => {
  const fields: FieldTSD[] = [];

  const m = { ...map_ts_types };
  const toTsType = (type: string) => m[type] ?? "any";

  for (const [variableName, variableDeclaration] of Object.entries(
    declaration.variables
  )) {
    fields.push(
      new FieldTSD(
        variableName,
        new SymbolTSD(toTsType(variableDeclaration.type))
      )
    );
  }

  return new StructTSD(fields);
};
