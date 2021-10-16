import { Base } from "../components/base";

export type BaseSerializeOption<T extends Base> = PickExcludeBufferValue<T>;
type PickExcludeBufferValue<T extends Base, A = ReturnType<T["toJSON"]>> = Pick<
  A,
  Exclude<keyof A, "pos" | "end">
>;
