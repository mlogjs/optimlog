import { Directive } from "./directives";
import { Locatable } from "./location";

export interface TokenizedLine extends Locatable {
	tokens: Token[];
	directives: Token[];
}

export interface Token extends Locatable {
	value: string;
}

export interface DirectiveToken extends Token {
	value: Directive;
}
