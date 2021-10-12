import { DataSourceParsed } from "../DataSourceParsed";

export interface loadResult extends DataSourceParsed {
  dsn: string;
}
