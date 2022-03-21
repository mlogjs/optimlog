import { Locatable, Reference } from ".";
import { Instruction, ConditionalJumpInstruction } from "./instructions";

export type BlockKind = "next" | "jump" | "reference" | "end";

export interface BaseBlock extends Locatable {
	kind: BlockKind;
	instructions: Instruction[];
}

export interface NextBlock extends BaseBlock {
	kind: "next";
	next: number;
}

export interface EndBlock extends BaseBlock {
	kind: "end";
}

export interface JumpBlock extends BaseBlock {
	kind: "jump";
	next: number;
	jump: ConditionalJumpInstruction;
}

export interface ReferenceBlock extends BaseBlock {
	kind: "reference";
	reference: Reference;
}

export type Block = NextBlock | JumpBlock | ReferenceBlock | EndBlock;

export type BlockMap = Record<number, Block>;

export type JumpLandMap = Record<number, number>;
