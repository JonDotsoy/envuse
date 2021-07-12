import { Base } from "../comps/Base";

export type BaseSerializeOption<T extends Base> = PickExcludeBufferValue<T>;
type PickExcludeBufferValue<T extends Base, A = ReturnType<T['toJSON']>> = Pick<A, Exclude<keyof A, 'pos' | 'end'>>;
