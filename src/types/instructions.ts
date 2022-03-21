import { BinaryOpMode, UnaryOpMode } from "./ops";
import { Locatable } from "./location";
import { ConditionalJumpMode } from "./jumps";
import { Reference, Value } from "./values";
import { AlwaysJumpMode } from ".";

export type LabelMap = Record<string, number>;

export interface BaseInstruction extends Locatable {
	kind: string;
	keep?: boolean;
	inputs: string[];
	outputs: string[];
}

export interface SetInstruction extends BaseInstruction {
	kind: "set";
	target: Reference;
	value: Value;
	inputs: ["value"];
	outputs: ["target"];
}

export interface UnaryOpInstruction extends BaseInstruction {
	kind: "op";
	mode: UnaryOpMode;
	target: Reference;
	operand: Value;
	inputs: ["operand"];
	outputs: ["target"];
}

export interface BinaryOpInstruction extends BaseInstruction {
	kind: "op";
	mode: BinaryOpMode;
	target: Reference;
	leftOperand: Value;
	rightOperand: Value;
	inputs: ["leftOperand", "rightOperand"];
	outputs: ["target"];
}

export interface ConditionalJumpInstruction extends BaseInstruction {
	kind: "jump";
	address: number;
	mode: ConditionalJumpMode;
	leftOperand: Value;
	rightOperand: Value;
	inputs: ["leftOperand", "rightOperand"];
	outputs: [];
}

export interface AlwaysJumpInstruction extends BaseInstruction {
	kind: "jump";
	address: number;
	mode: AlwaysJumpMode;
	inputs: [];
	outputs: [];
}

export type Instruction =
	| SetInstruction
	| UnaryOpInstruction
	| BinaryOpInstruction
	| ConditionalJumpInstruction
	| AlwaysJumpInstruction;
