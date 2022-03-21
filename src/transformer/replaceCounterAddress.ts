import { Context, TokenizedLine } from "../types";

export function replaceCounterAddress(
	_ctx: Context,
	lines: TokenizedLine[]
): TokenizedLine[] {
	return lines
		.map((line, i) => {
			const { tokens } = line;
			if (tokens[0]?.value !== "set") return line;
			const counter = tokens[2]?.value;
			if (counter !== "@counter") return line;
			const copy = [...tokens];
			copy[2].value = i + "";
			return { ...line, tokens: copy };
		})
		.filter(({ tokens: [token] }) => !token?.value.endsWith(":"));
}
