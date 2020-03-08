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

const MARKED = 'o';
const NO_MARK = ' ';
const DONE = 'x';
const ARCHIVED = 'A';
const ERROR = '!';

// issue: Dev refactors multi if blocks #125
export const getMark = (i: ITodoItem): string => {
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

export const stringifyTodoItem = (i : ITodoItem): string => {
	return `${getMark(i)} ${i.header}`;
}

// ready for review
export const isReady = (i: ITodoItem): boolean => {
	return i.state === TodoState.Unmarked || i.state === TodoState.Marked;
}