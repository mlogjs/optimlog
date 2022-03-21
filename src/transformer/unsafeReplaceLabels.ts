import { Context, LabelMap, TokenizedLine } from "../types";

export function unsafeReplaceLabel(
	_ctx: Context,
	lines: TokenizedLine[],
	labels: LabelMap
): TokenizedLine[] {
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
