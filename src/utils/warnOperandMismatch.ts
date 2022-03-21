import { log } from "./log";
import { Context, Token } from "../types";

export function warnOperandMismatch(
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
		log(ctx, "error", "missing operands", {
			start: operands[0].location.start,
			end: operands[operands.length - 1].location.end,
		});
	}
}
