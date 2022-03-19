export const jumpModes = [
	"equal",
	"notEqual",
	"lessThan",
	"lessThanEq",
	"greaterThan",
	"greaterThanEq",
	"strictEqual",
	"always",
];

export type JumpMode = typeof jumpModes[number];
