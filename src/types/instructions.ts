import { BinaryOpMode, UnaryOpMode } from "./ops";
import { Locatable } from "./location";
import { JumpMode } from "./jumps";
import { Reference, Value } from "./values";

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

export interface JumpInstruction extends BaseInstruction {
	kind: "jump";
	address: number;
	mode: JumpMode;
	leftOperand: Value;
	rightOperand: Value;
	inputs: ["leftOperand", "rightOperand"];
	outputs: [];
}

export type Instruction =
	| SetInstruction
	| UnaryOpInstruction
	| BinaryOpInstruction
	| JumpInstruction;
