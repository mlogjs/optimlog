import { Context, Token, TokenizedLine } from "../types";
import { log } from "../utils";

export function normalizeDirectives(
	ctx: Context,
	lines: TokenizedLine[]
): TokenizedLine[] {
	const normalized: TokenizedLine[] = [];

	const directives: Token[] = [];

	for (const line of lines) {
		if (line.tokens.length === 0) {
			for (const directive of line.directives) {
				const [value, mode] = directive.value.split(":");
				if (mode === "begin") {
					directives.push({
						...directive,
						value,
					});
				} else if (mode === "end") {
					const last = directives.pop();
					if (last?.value !== value) {
						log(ctx, "warn", "line directive mismatch", directive.location);
						if (last) directives.push(last);
					}
				} else if (mode === undefined) {
					log(
						ctx,
						"error",
						`missing line directive mode`,
						directive.location,
						`line directive mode must be 'begin' or 'end'`
					);
				} else {
					log(
						ctx,
						"error",
						`invalid line directive mode ${mode}`,
						directive.location,
						`line directive mode must be 'begin' or 'end'`
					);
				}
			}
			continue;
		}
		normalized.push({
			...line,
			directives: [...new Set([...directives, ...line.directives])],
		});
	}

	for (const directive of directives) {
		log(ctx, "warn", "directive is not ended", directive.location);
	}

	return normalized;
}
