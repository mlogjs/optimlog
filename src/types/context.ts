import { Log } from "./log";

export interface Options {
	unsafeReplaceLabel: boolean;
}

export interface Context {
	logs: Log[];
	options: Options;
}
