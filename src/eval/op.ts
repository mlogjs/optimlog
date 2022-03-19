import {
	KnownBinaryOpMap,
	KnownUnaryOpMap,
	UnknownBinaryOpMap,
	UnknownUnaryOpMap,
} from "../types";

export const knownBinaryOpMap: KnownBinaryOpMap = {
	pow: Math.pow,
	max: Math.max,
	min: Math.min,
	add: (a, b) => a + b,
	sub: (a, b) => a - b,
	mul: (a, b) => a * b,
	div: (a, b) => a / b,
	idiv: (a, b) => Math.floor(a / b),
	mod: (a, b) => a % b,
	equal: (a, b) => (Math.abs(a - b) < 0.000001 ? 1 : 0),
	notEqual: (a, b) => (Math.abs(a - b) < 0.000001 ? 0 : 1),
	land: (a, b) => (a != 0 && b != 0 ? 1 : 0),
	lessThan: (a, b) => (a < b ? 1 : 0),
	lessThanEq: (a, b) => (a <= b ? 1 : 0),
	greaterThan: (a, b) => (a > b ? 1 : 0),
	greaterThanEq: (a, b) => (a >= b ? 1 : 0),
	strictEqual: (a, b) => (a === b ? 1 : 0),
	angle: (x, y) => Math.atan2(y, x),
	len: (x, y) => Math.sqrt(x ** 2 + y ** 2),
	shl: (a, b) => a << b,
	shr: (a, b) => a >> b,
	or: (a, b) => a | b,
	and: (a, b) => a & b,
	xor: (a, b) => a ^ b,
};

export const unknownBinaryOpMap: UnknownBinaryOpMap = {
	noise: () => Math.random(),
} as const;

const degRad = Math.PI / 180;
const radDeg = 180 / Math.PI;

export const knownUnaryOpMap: KnownUnaryOpMap = {
	not: (a) => ~a,
	abs: (a) => Math.abs(a), //not a method reference because it fails to compile for some reason
	log: Math.log,
	log10: Math.log10,
	floor: Math.floor,
	ceil: Math.ceil,
	sqrt: Math.sqrt,
	sin: (d) => Math.sin(d * degRad),
	cos: (d) => Math.cos(d * degRad),
	tan: (d) => Math.tan(d * degRad),
	asin: (d) => Math.asin(d) * radDeg,
	acos: (d) => Math.acos(d) * radDeg,
	atan: (d) => Math.atan(d) * radDeg,
} as const;

export const unknownUnaryOpMap: UnknownUnaryOpMap = {
	rand: (a) => Math.random() * a,
} as const;
