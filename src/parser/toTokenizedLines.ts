import { Context, Token, TokenizedLine } from "../types";

function tokenizeLine(
	_ctx: Context,
	code: string,
	y: number
): TokenizedLine {
	const tokens: Token[] = [];
	const directives: Token[] = [];
	const line = y + 1;

	let value = "";
	let isQuote = false;
	let isComment = false;
	let isDirective = false;
	let startColumn = 1;

	function push(endColumn: number, list: Token[]) {
		if (value === "") return;
		list.push({
			location: {
				start: { line, column: startColumn },
				end: { line, column: endColumn },
			},
			value,
		});
		value = "";
	}

	for (let i = 0; i < code.length; i++) {
		const char = code[i];

		if (isDirective) {
			if (char === " ") {
				isDirective = false;
				push(i + 1, directives);
			}
			value += char;
			continue;
		}

		if (isComment) {
			if (code.startsWith("@om-", i)) {
				value += "@om-";
				isDirective = true;
				startColumn = i + 1;
				i += 3;
			}
			continue;
		}

		if (isQuote) {
			value += char;
			if (char === '"') {
				isQuote = false;
				push(i + 1, tokens);
			}
			continue;
		}

		if (char === '"') {
			value += char;
			isQuote = true;
			startColumn = i + 1;
			continue;
		}

		if (char === "#") {
			isComment = true;
			continue;
		}

		if (char === " ") {
			push(i + 1, tokens);
			startColumn = i + 1;
			continue;
		}

		value += char;
	}

	push(code.length, isDirective ? directives : tokens);

	return {
		tokens,
		directives,
		location: {
			start: {
				line,
				column: 0,
			},
			end: {
				line,
				column: startColumn,
			},
		},
	};
}

export function toTokenizedLines(ctx: Context, code: string): TokenizedLine[] {
	const lines = code.trim().split("\n");
	return lines
		.map((line, i) => tokenizeLine(ctx, line, i))
		.filter(({ tokens, directives }) => tokens.length || directives.length);
}
