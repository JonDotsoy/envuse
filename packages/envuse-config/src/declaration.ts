import { EnvuseDeclaration } from "./types/envuse-declaration";
import { NodeDocument } from "./types/node";

export const describeDeclaration = (
  document: NodeDocument
): EnvuseDeclaration => {
  const declaration: EnvuseDeclaration = {
    variables: {},
  };

  document[1].Document.nodes.forEach((node) => {
    if ("Variable" in node[1]) {
      const variableName = node[1].Variable.variable_name[1].VariableName.name;

      declaration.variables[variableName] = {
        // @ts-ignore
        type:
          node[1].Variable.variable_type?.[1].VariableType.variable_type[1]
            .VariableName.name ?? "string",
        value_template: null,
        _node: node ?? null,
      };
    }
  });

  return declaration;
};
