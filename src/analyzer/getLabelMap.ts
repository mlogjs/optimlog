import { Context, LabelMap, TokenizedLine } from "../types";
import { log } from "../utils";

export function getLabelMap(ctx: Context, lines: TokenizedLine[]): LabelMap {
	const labels: LabelMap = {};
	let address = 0;

	for (const { tokens } of lines) {
		if (!tokens.length) continue;
		if (tokens[tokens.length - 1].value === ":") {
			log(ctx, "error", "malformed label", tokens[0].location);
		}
		const [{ value }] = tokens;
		if (value.endsWith(":")) {
			labels[value.slice(0, -1)] = address;
		} else {
			address++;
		}
	}

	return labels;
}
