import { Context, Location, LogLevel } from "../types";

export const FAILED = Symbol("failed");

const nullLocation = {
	start: { line: -1, column: -1 },
	end: { line: -1, column: -1 },
};

export function log(
	ctx: Context,
	level: LogLevel,
	message: string,
	location: Location = nullLocation,
	details = ""
) {
	ctx.logs.push({
		level,
		location,
		message,
		details,
	});
	if (level === "error") throw FAILED;
}
