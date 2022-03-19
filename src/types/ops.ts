export const knownBinaryOpModes = [
	"pow",
	"max",
	"min",
	"add",
	"sub",
	"mul",
	"div",
	"idiv",
	"mod",
	"equal",
	"notEqual",
	"land",
	"lessThan",
	"lessThanEq",
	"greaterThan",
	"greaterThanEq",
	"strictEqual",
	"angle",
	"len",
	"shl",
	"shr",
	"or",
	"and",
	"xor",
] as const;

export type KnownBinaryOpMode = typeof knownBinaryOpModes[number];

export const knownUnaryOpModes = [
	"not",
	"abs",
	"log",
	"log10",
	"floor",
	"ceil",
	"sqrt",
	"sin",
	"cos",
	"tan",
	"asin",
	"acos",
	"atan",
] as const;

export type KnownUnaryOpMode = typeof knownUnaryOpModes[number];

export const unknownBinaryOpModes = ["noise"] as const;
export const unknownUnaryOpModes = ["rand"] as const;

export type UnknownBinaryOpMode = typeof unknownBinaryOpModes[number];
export type UnknownUnaryOpMode = typeof unknownUnaryOpModes[number];

export const binaryOpModes = [
	...unknownBinaryOpModes,
	...knownBinaryOpModes,
] as const;

export const unaryOpModes = [
	...unknownUnaryOpModes,
	...knownUnaryOpModes,
] as const;

export type BinaryOpMode = typeof binaryOpModes[number];
export type UnaryOpMode = typeof unaryOpModes[number];

export type BinaryOpFn = (a: number, b: number) => number;
export type UnaryOpFn = (a: number) => number;

export type KnownBinaryOpMap = Record<KnownBinaryOpMode, BinaryOpFn>;
export type UnknownBinaryOpMap = Record<UnknownBinaryOpMode, BinaryOpFn>;
export type KnownUnaryOpMap = Record<KnownUnaryOpMode, BinaryOpFn>;
export type UnknownUnaryOpMap = Record<UnknownUnaryOpMode, BinaryOpFn>;
