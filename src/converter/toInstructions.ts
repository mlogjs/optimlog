import {
	BinaryOpInstruction,
	BinaryOpMode,
	binaryOpModes,
	ConditionalJumpMode,
	Context,
	Instruction,
	jumpModes,
	Token,
	TokenizedLine,
	UnaryOpInstruction,
	UnaryOpMode,
	unaryOpModes,
	Location,
} from "../types";
import { log } from "../utils";
import {
	expectAddress,
	expectReference,
	expectValue,
} from "../utils/expectations";
import { warnOperandMismatch } from "../utils/warnOperandMismatch";

function getLocation(tokens: Token[]): Location {
	return {
		start: tokens[0].location.start,
		end: tokens[tokens.length - 1].location.end,
	};
}

const mapper: Record<string, (ctx: Context, tokens: Token[]) => Instruction> = {
	set(ctx, tokens) {
		warnOperandMismatch(ctx, tokens, 3, 3);
		const [_set, target, value] = tokens;
		return {
			kind: "set",
			target: expectReference(ctx, target),
			value: expectValue(ctx, value),
			location: getLocation(tokens),
			inputs: ["value"],
			outputs: ["target"],
		};
	},
	op(ctx, tokens) {
		warnOperandMismatch(ctx, tokens, 4, 5);
		const [_op, mode, target, left, right] = tokens;
		const common = {
			kind: "op",
			location: getLocation(tokens),
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
		throw log(ctx, "error", "expected valid op mode", mode.location);
	},
	jump(ctx, tokens) {
		warnOperandMismatch(ctx, tokens, 3, 5);
		const [jump, address, mode, left, right] = tokens;
		if (!jumpModes.includes(mode.value as ConditionalJumpMode)) {
			throw log(ctx, "error", "invalid jump mode", mode.location);
		}
		if (mode.value === "always") {
			return {
				kind: "jump",
				mode: "always",
				address: expectAddress(ctx, address),
				inputs: [],
				outputs: [],
				location: getLocation(tokens),
			};
		}
		return {
			kind: "jump",
			mode: mode.value as ConditionalJumpMode,
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
