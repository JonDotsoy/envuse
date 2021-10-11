import { StatementObjectTypes } from "../tdo/statement-object-types";

export type typesValues =
  typeof StatementObjectTypes[keyof typeof StatementObjectTypes];
