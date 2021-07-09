

export type ArgsType<T> = T extends (...args: infer R) => any ? R : [];
