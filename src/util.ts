export const getPluralS = (n: number): string => {
	return n !== 1 ? "s" : ""
}

export const isUndefined = (x: string) => x !== "" && x !== null;