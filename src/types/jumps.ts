export const conditionalJumpModes = [
	"equal",
	"notEqual",
	"lessThan",
	"lessThanEq",
	"greaterThan",
	"greaterThanEq",
	"strictEqual",
] as const;

export const alwaysJumpModes = ["always"] as const;

export const jumpModes = [...conditionalJumpModes, ...alwaysJumpModes];

export type AlwaysJumpMode = typeof alwaysJumpModes[number];
export type ConditionalJumpMode = typeof conditionalJumpModes[number];
export type JumpMode = AlwaysJumpMode | ConditionalJumpMode;
