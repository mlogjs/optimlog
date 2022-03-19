import { Instruction, JumpInstruction } from "./instructions";

export interface Group {
	instructions: Instruction[];
	next?: Group;
	jump?: JumpInstruction;
}
