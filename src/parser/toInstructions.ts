import {
	BinaryOpInstruction,
	BinaryOpMode,
	binaryOpModes,
	Instruction,
	JumpMode,
	jumpModes,
	Context,
	Token,
	TokenizedLine,
	UnaryOpInstruction,
	UnaryOpMode,
	unaryOpModes,
} from "../types";
import { log } from "../utils";
import { expectAddress, expectReference, expectValue } from "./expectations";

function warnOperandMismatch(
	ctx: Context,
	operands: Token[],
	min: number,
	max: number
) {
	if (operands.length > max) {
		log(ctx, "warn", "surplus operands", {
			start: operands[max - 1].location.start,
			end: operands[operands.length - 1].location.end,
		});
	} else if (operands.length < min) {
		log(ctx, "warn", "missing operands", {
			start: operands[0].location.start,
			end: operands[operands.length - 1].location.end,
		});
	}
}

const mapper: Record<string, (ctx: Context, tokens: Token[]) => Instruction> = {
	set(ctx, tokens) {
		warnOperandMismatch(ctx, tokens, 3, 3);
		const [set, target, value] = tokens;
		return {
			kind: "set",
			target: expectReference(ctx, target),
			value: expectValue(ctx, value),
			location: set.location,
			inputs: ["value"],
			outputs: ["target"],
		};
	},
	op(ctx, tokens) {
		warnOperandMismatch(ctx, tokens, 4, 5);
		const [op, mode, target, left, right] = tokens;
		const common = {
			kind: "op",
			location: op.location,
			mode: mode.value,
			target: expectReference(ctx, target),
			outputs: ["target"],
		} as BinaryOpInstruction | UnaryOpInstruction;
		if (binaryOpModes.includes(mode.value as BinaryOpMode)) {
			return {
				...common,
				leftOperand: expectValue(ctx, left),
				rightOperand: expectValue(ctx, right),
				inputs: ["leftOperand", "rightOperand"],
			} as BinaryOpInstruction;
		}
		if (unaryOpModes.includes(mode.value as UnaryOpMode)) {
			if (right)
				log(
					ctx,
					"warn",
					"unary operation only needs one operand",
					right.location
				);
			return {
				...common,
				operand: expectValue(ctx, left),
				inputs: ["operand"],
			} as UnaryOpInstruction;
		}
		throw log(ctx, "error", "expected valid op mode", op.location);
	},
	jump(ctx, tokens) {
		warnOperandMismatch(ctx, tokens, 5, 5);
		const [jump, address, mode, left, right] = tokens;
		if (!jumpModes.includes(mode.value as JumpMode)) {
			throw log(ctx, "error", "invalid jump mode", mode.location);
		}
		return {
			kind: "jump",
			mode: mode.value as JumpMode,
			address: expectAddress(ctx, address),
			leftOperand: expectValue(ctx, left),
			rightOperand: expectValue(ctx, right),
			location: jump.location,
			inputs: ["leftOperand", "rightOperand"],
			outputs: [],
		};
	},
};

export function toInstructions(
	ctx: Context,
	lines: TokenizedLine[]
): Instruction[] {
	return lines.map((line) => {
		const { value, location } = line.tokens[0];
		if (!(value in mapper))
			throw log(ctx, "error", `invalid instruction '${value}'`, location);
		const instruction = mapper[value](ctx, line.tokens);

		for (const directive of line.directives) {
			if (directive.value === "@om-keep") {
				instruction.keep = true;
				continue;
			}
			log(ctx, "warn", `invalid directive '${directive.value}'`, location);
		}

		return instruction;
	});
}
