import { Context, Reference, Token, Value } from "../types";
import { log } from ".";

const referenceRe = /[^\-"0-9]+[^"]*/;
const addressRe = /[0-9]+/;
const stringRe = /"(.*)"/;

export function expectReference(
	ctx: Context,
	{ value, location }: Token
): Reference {
	if (value === null) {
		throw log(ctx, "error", "reference name cannot be 'null'", location);
	}
	if (referenceRe.test(value)) return { name: value };
	throw log(ctx, "error", "expected reference", location);
}

export function expectAddress(ctx: Context, { value, location }: Token) {
	if (addressRe.test(value)) return +value;
	throw log(ctx, "error", "expected address", location);
}

export function expectValue(ctx: Context, { value, location }: Token): Value {
	if (value === "true") return 1;
	if (value === "false") return 0;
	if (value === "null") return null;
	const match = value.match(stringRe);
	if (match) return match[1];
	if (referenceRe.test(value)) return { name: value };
	const n = +value;
	if (isFinite(n)) return n;
	throw log(
		ctx,
		"error",
		"expected reference, number, null or string",
		location
	);
}
