import {getMark, ITodoItem} from './todoItem';

export const generalPrint = (s: string): void => {
	// tslint:disable-next-line:no-console
	console.log(s);
}

const stringifyTodoItem = (i : ITodoItem): string => {
	return `${getMark(i)} ${i.header}`;
}

const printTodoItem = (i: ITodoItem):void => {
	generalPrint(stringifyTodoItem(i));
}

export const getPluralS = (n: number): string => {
	return n !== 1 ? "s" : ""
}

export const printTodoItemCount = (list: ITodoItem[]):void => {
	generalPrint(`You have ${list.length} todo item${getPluralS(list.length)}.`);
}

export const makePrintableTodoItemList = (list: ITodoItem[]):string => {
	let temp: string = "";
	if(list.length === 0) {
		temp = "There are no todo items to print.";
	} else {
		temp = list.map(x => stringifyTodoItem(x)).join("\n");
	}
	return temp;
}

export const printTodoItemList = (list: ITodoItem[]):void => {
	generalPrint(makePrintableTodoItemList(list));
}