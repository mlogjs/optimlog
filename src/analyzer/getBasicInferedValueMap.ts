import {
	Context,
	InferedValueMap,
	Instruction,
	numericValue,
	UnresolvedValue,
	UnresolvedValueMap,
} from "../types";
import { isReference } from "../utils/isReference";

export function getBasicInferedValueMap(
	_ctx: Context,
	instructions: Instruction[]
): InferedValueMap {
	const map: UnresolvedValueMap = {};

	function add(name: string, value: UnresolvedValue) {
		const values = map[name];
		if (values) {
			if (!values.includes(value)) {
				values.push(value);
			}
			if (values.includes(numericValue)) {
				map[name] = values.filter((v) => {
					return typeof v !== "number" || typeof v !== "object";
				});
			}
		} else {
			map[name] = [value];
		}
	}

	for (const instruction of instructions) {
		switch (instruction.kind) {
			case "set":
				if (instruction.target.name === "@counter") break;
				add(instruction.target.name, instruction.value);
				break;
			case "op":
				add(instruction.target.name, numericValue);
				break;
		}
	}

	do {
		for (const [name, values] of Object.entries(map)) {
			for (const value of values) {
				if (isReference(value)) {
					values.splice(values.indexOf(value), 1);
					for (const value2 of map[value.name]) {
						if (typeof value2 === "object" && value2?.name === name) continue;
						add(name, value2);
					}
				}
			}
		}
	} while (
		Object.values(map)
			.flat()
			.find((v) => typeof v === "object" && v?.name)
	);

	return map as InferedValueMap;
}
