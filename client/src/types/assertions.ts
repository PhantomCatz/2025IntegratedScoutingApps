import type { Constructor } from './utilityTypes';

export function assertInstanceOf<T>(value: unknown, constructor: Constructor<T>): asserts value is T {
	if(!(value instanceof constructor)) {
		throw new Error(`Assertion Error: ${value} is not instance of ${constructor.name}`)
	}
}

export function assertBoolean(value: unknown): asserts value is boolean {
	if(!(typeof value === "boolean")) {
		throw new Error(`Assertion Error: ${value} is not boolean`)
	}
}

export function assertString(value: unknown): asserts value is string {
	if(!(typeof value === "string")) {
		throw new Error(`Assertion Error: ${value} is not string`)
	}
}

export function assertNumber(value: unknown): asserts value is number {
	if(!(typeof value === "number")) {
		throw new Error(`Assertion Error: ${value} is not number`)
	}
}

export function assertNonNull<T>(value: T): asserts value is NonNullable<T> {
	if(value === undefined) {
		throw new Error(`Assertion Error: ${value} is undefined`);
	}
	if(value === null) {
		throw new Error(`Assertion Error: ${value} is null`);
	}
}
