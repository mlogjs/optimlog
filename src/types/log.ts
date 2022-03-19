import { Locatable } from "./location";

export type LogLevel = "error" | "warn" | "info" | "debug";

export interface Log extends Locatable {
	level: LogLevel;
	message: string;
	details: string;
}