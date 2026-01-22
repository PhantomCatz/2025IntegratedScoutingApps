export type Constructor<T = unknown, Args extends ReadonlyArray<unknown> = unknown[]> = abstract new(...args: Args) => T;

export type StringMap<T> = Extract<keyof T, string>;
