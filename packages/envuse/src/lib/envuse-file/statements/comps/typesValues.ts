import { StatementObjectTypes } from "../tdo/StatementObjectTypes";

export type typesValues = typeof StatementObjectTypes[keyof typeof StatementObjectTypes];
