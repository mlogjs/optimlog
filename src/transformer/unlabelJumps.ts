import { Context, LabelMap, TokenizedLine } from "../types";
import { log } from "../utils";

export function unlabelJumps(
	ctx: Context,
	lines: TokenizedLine[],
	labels: LabelMap
): TokenizedLine[] {
	return lines
		.map((line) => {
			const { tokens } = line;
			if (tokens[0]?.value !== "jump") return line;
			const label = tokens[1]?.value;
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
