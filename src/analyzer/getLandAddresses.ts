import { Context, InferedValueMap, Instruction } from "../types";
import { log } from "../utils";
import { isReference } from "../utils/isReference";

export function getLandAddresses(
	ctx: Context,
	instructions: Instruction[],
	values: InferedValueMap
): Set<number> {
	const lands: Set<number> = new Set();

	function add(address: number, instruction: Instruction) {
		if (address >= instructions.length || address < 0) {
			log(
				ctx,
				"error",
				`cannot branch to invalid address ${address}`,
				instruction.location
			);
		}
		lands.add(address);
	}

	instructions.forEach((instruction) => {
		switch (instruction.kind) {
			case "jump": {
				add(instruction.address, instruction);
				break;
			}
			case "set": {
				if (instruction.target.name === "@counter") {
					if (typeof instruction.value === "number") {
						add(instruction.value, instruction);
					} else if (isReference(instruction.value)) {
						for (const value of values[instruction.value.name]) {
							if (typeof value !== "number" || value % 1 !== 0 || value < 0) {
								throw log(
									ctx,
									"error",
									`failed to perform branch analysis`,
									instruction.location,
									`${
										instruction.value.name
									} must be a known unsigned integer, instead found ${String(value)}`
								);
							}
							add(value, instruction);
						}
					}
				}
			}
		}
	});

	return lands;
}
