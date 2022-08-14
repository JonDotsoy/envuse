import { ConfigTypes, ConfigTypesSchema } from "./types/config-types";
import { describeDeclarationTs } from "./declaration-ts";
import { FieldTSD, StructTSD } from "./utils/TSD";
import { EnvuseDeclaration } from "./types/envuse-declaration";

const parseInitialOptions = (payload: string): ConfigTypes => {
  try {
    const initialOptionsExec = /^\/\*\* \@declaration ([^\n]+) \*\/\n/.exec(
      payload
    );
    const initialOptions: ConfigTypes = initialOptionsExec
      ? ConfigTypesSchema.parse(JSON.parse(initialOptionsExec[1]))
      : { configTypes: {} };
    return initialOptions;
  } catch {
    return {
      configTypes: {},
    };
  }
};

export const updateDeclarationPayload = (
  payload: string,
  key: string,
  declaration: EnvuseDeclaration
): string => {
  const initialOptions = parseInitialOptions(payload);

  initialOptions.configTypes[key] = declaration;

  const fields: FieldTSD[] = [];

  for (const [key, declaration] of Object.entries(initialOptions.configTypes)) {
    fields.push(new FieldTSD(key, describeDeclarationTs(declaration)));
  }

  const t = new StructTSD(fields);

  const newLocal = JSON.stringify(initialOptions, (k, v) =>
    k.startsWith("_") ? null : v
  );
  return `/** @declaration ${newLocal} */\n\nexport type listConfigTypes =${t.toTSDString(
    0
  )}`;
};
