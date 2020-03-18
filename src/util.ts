import { throwBadInputError } from "../unit/test-util";

export const getPluralS = (n: number): string => {
	return n !== 1 ? "s" : ""
}

export const isDefinedString = (x: string) => x !== "" && x !== null;

export const isNeg1 = (i: number): boolean => {
	return i === -1;
}

export const getMinFrom0Up = (x: number, y: number): number => {
	if(x < -1 || y < -1) {
		throwBadInputError();
	}
	return isNeg1(x) && isNeg1(y) ? -1 :
		!isNeg1(x) && isNeg1(y) ? x :
			isNeg1(x) && !isNeg1(y) ? y :
			Math.min(x, y);
}

export const isEmpty = (arrIn: any[]): boolean => {
	return arrIn.length === 0;
}