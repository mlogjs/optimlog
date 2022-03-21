import {
	BaseBlock,
	Block,
	BlockKind,
	BlockMap,
	Context,
	InferedValueMap,
	Instruction,
	Position,
} from "../types";
import { log } from "../utils";
import { isReference } from "../utils/isReference";

export function toBlockMap(
	ctx: Context,
	instructions: Instruction[],
	values: InferedValueMap,
	lands: Set<number>
) {
	const map: BlockMap = {};

	let content: Instruction[] = [];
	let address = 0;

	function add(i: number, jump: boolean, block: Block) {
		map[address] = block;
		if (jump) content.length--;
		address = i + 1;
		content = [];
	}

	function common(): Omit<BaseBlock, "kind"> {
		return {
			instructions: content,
			location: {
				start: content[0]?.location.start,
				end: content[content.length - 1]?.location.end,
			},
		};
	}

	instructions.forEach((instruction, i) => {
		content.push(instruction);

		if (instruction.kind === "set" && instruction.target.name === "@counter") {
			if (typeof instruction.value === "number") {
				add(i, true, {
					...common(),
					kind: "next",
					next: instruction.value,
				});
			} else if (isReference(instruction.value)) {
				add(i, true, {
					...common(),
					kind: "reference",
					reference: instruction.value,
				});
			} else {
				log(
					ctx,
					"error",
					"set @counter <value> expects value to be an integer"
				);
			}
		} else if (instruction.kind === "jump") {
			if (instruction.mode === "always") {
				add(i, true, {
					...common(),
					kind: "next",
					next: instruction.address,
				});
			} else {
				add(i, true, {
					...common(),
					kind: "jump",
					next: i,
					jump: instruction,
				});
			}
		} else if (lands.has(i + 1)) {
			add(i, false, {
				...common(),
				kind: "next",
				next: i + 1,
			});
		}
	});

	if (content.length !== 0) {
		add(0, false, {
			...common(),
			kind: "end",
		});
	}

	return map;
}
