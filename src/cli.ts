import {getMark, ITodoItem} from './todoItem';

export const generalPrint = (s: string): void => {
	// tslint:disable-next-line:no-console
	console.log(s);
}

const printTodoItem = (i: ITodoItem):void => {
	generalPrint(`${getMark(i)} ${i.header}`);
}

export const printTodoItemCount = (list: ITodoItem[]):void => {
	let plural = "";
	if(list.length !== 1) {
		plural = "s";
	}
	generalPrint(`You have ${list.length} todo item${plural}.`);
}

export const printTodoItemList = (list: ITodoItem[]):void => {
	list.map(x => printTodoItem(x));
}