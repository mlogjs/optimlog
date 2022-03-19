import { Context, TokenizedLine } from "../types";
import { getLabels } from "./getLabels";

export function unsafeReplaceLabel(
	ctx: Context,
	lines: TokenizedLine[]
): TokenizedLine[] {
	const labels = getLabels(ctx, lines);
	return lines
		.map((line) => {
			return {
				...line,
				tokens: line.tokens.map(({ value, location }) => {
					return {
						value: value in labels ? labels[value] + "" : value,
						location,
					};
				}),
			};
		})
		.filter(({ tokens: [token] }) => !token?.value.endsWith(":"));
}
