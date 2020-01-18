import {ITodoItem, TodoState} from './todoItem';

const MARKED = 'o';
const NO_MARK = ' ';
const DONE = 'x';
const ARCHIVED = 'A';
const ERROR = '!';

const getMark = (i: ITodoItem): string => {
	if(i.state === TodoState.Marked) {
		return `[${MARKED}]`;
	}
	if(i.state === TodoState.Unmarked) {
		return `[${NO_MARK}]`;
	}
	if(i.state === TodoState.Completed) {
		return `[${DONE}]`;
	}
	if(i.state === TodoState.Archived) {
		return `[${ARCHIVED}]`;
	}
	return `[${ERROR}]`; // error state indicator
}

export const printTodoItem = (i: ITodoItem):void => {
	const temp = `${getMark(i)} ${i.header}`
	// tslint:disable-next-line:no-console
	console.log(temp);
}

export const generalPrint = (s: string): void => {
	// tslint:disable-next-line:no-console
	console.log(s);
}