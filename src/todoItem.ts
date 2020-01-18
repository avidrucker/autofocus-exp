import {generalPrint, printTodoItem} from './utility';

export enum TodoState {
	Unmarked,
	Marked,
	Completed,
	Archived
}

export interface ITodoItem {
	body?: string|null;
	created: string;
	header: string;
	modified: string;
	state: TodoState;
	uuid: string;
}

export const constructNewTodoItem = ( headerText:string, bodyText:string="", stateIn:TodoState=TodoState.Unmarked): ITodoItem => {
	const newItem: ITodoItem = {
			body: bodyText,
			created:"temp_created_date",
			header: headerText,
			modified:"temp_created_date",
			state: stateIn,
			uuid:"temp_unique_universal_identifier"
	}
	return newItem;
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