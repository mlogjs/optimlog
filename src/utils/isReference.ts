import { Reference, UnresolvedValue } from "../types";

export function isReference(value: UnresolvedValue): value is Reference {
	return typeof value === "object" && value !== null;
}
