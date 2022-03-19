import { Context, TokenizedLine } from "../types";
import { log } from "../utils";
import { getLabels } from "./getLabels";

export function unlabelJumps(
	ctx: Context,
	lines: TokenizedLine[]
): TokenizedLine[] {
	const labels = getLabels(ctx, lines);
	return lines
		.map((line) => {
			const { tokens, location } = line;
			if (tokens[0]?.value !== "jump") return line;
			const label = tokens[1].value;
			if (label === undefined) {
				log(ctx, "error", `expected address or label`, location);
			}
			if (isFinite(+label)) return line;
			const jump = labels[label] ?? -1;
			if (jump < 0) {
				log(ctx, "error", `label ${label} not found`, tokens[1].location);
			}
			const copy = [...tokens];
			copy[1].value = jump + "";
			return { ...line, tokens: copy };
		})
		.filter(({ tokens: [token] }) => !token?.value.endsWith(":"));
}
