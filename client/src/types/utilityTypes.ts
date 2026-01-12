export type Constructor<T = unknown, Args extends ReadonlyArray<unknown> = unknown[]> = abstract new(...args: Args) => T;

export function assertInstanceOf<T>(value: unknown, constructor: Constructor<T>): asserts value is T {
	if(!(value instanceof constructor)) {
		throw new Error(`${value} is not instance of ${constructor.name}`)
	}
}

export function assertBoolean(value: unknown): asserts value is boolean {
	if(!(typeof value === "boolean")) {
		throw new Error(`${value} is not boolean`)
	}
}

export function assertString(value: unknown): asserts value is string {
	if(!(typeof value === "string")) {
		throw new Error(`${value} is not string`)
	}
}

export function assertNumber(value: unknown): asserts value is number {
	if(!(typeof value === "number")) {
		throw new Error(`${value} is not number`)
	}
}

export type StringMap<T> = Extract<keyof T, string>;
