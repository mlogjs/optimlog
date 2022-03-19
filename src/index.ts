import { toInstructions } from "./parser/toInstructions";
import { normalizeDirectives } from "./parser/normalizeDirectives";
import { toTokenizedLines } from "./parser/toTokenizedLines";
import { unlabelJumps } from "./transforms/unlabelJumps";
import { Context } from "./types";
import { basicVariableInfer } from "./analyzer/basicVariableInfer";

const code = `
set a c
set b a
set c b
set a 1
`;

const ctx: Context = {
	options: {
		unsafeReplaceLabel: true,
	},
	logs: [],
};

try {
	const tokens = toTokenizedLines(ctx, code);
	const unlabeled = unlabelJumps(ctx, tokens);
	const normalized = normalizeDirectives(ctx, unlabeled);
	const deserialized = toInstructions(ctx, normalized);
	console.log(deserialized);
	console.log(basicVariableInfer(ctx, deserialized));
} finally {
	console.log(ctx.logs);
}
