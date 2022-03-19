export const buildingValue = Symbol("buildingValue");
export const unitValue = Symbol("unitValue");
export const numericValue = Symbol("numericValue");

export type BuildingValue = typeof buildingValue;
export type UnitValue = typeof unitValue;
export type NumericValue = typeof numericValue;

export type UnresolvedValue = InferedValue | Reference;
export type UnresolvedValueMap = Record<string, UnresolvedValue[]>;
export type InferedValueMap = Record<string, InferedValue[]>;

export interface Reference {
	name: string;
}

export type LiteralValue = number | null | string;
export type Value = LiteralValue | Reference;
export type InferedValue =
	| LiteralValue
	| BuildingValue
	| UnitValue
	| NumericValue;