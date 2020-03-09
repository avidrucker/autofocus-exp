import { getMark, ITodoItem, stringifyTodoItem, TodoState } from "./todoItem";

export const indexOfItem = (list: any[], attr: any, val: any): number => {
	return list.map((e) => e[attr]).indexOf(val);
}

export const lastIndexOfItem = (list: any[], attr: any, val: any): number => {
	return list.map((e) => e[attr]).lastIndexOf(val);
}

export const itemExists = (list: any[], attr: any, val: any): boolean => {
	return indexOfItem(list, attr, val) !== -1;
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

export const listToMarks = (todoList: ITodoItem[]): string => {
	return todoList.map(x => getMark(x)).join(" ");
}

export const addTodoToList = (todoList: ITodoItem[], newTodoItem: ITodoItem): ITodoItem[] => {
	todoList.push(newTodoItem);
	return todoList;
}

// returns -1 if there are no unmarked items
export const getFirstUnmarked = (todoList: ITodoItem[]): number => {
	return indexOfItem(todoList, "state", TodoState.Unmarked);
}

// returns -1 if there are no marked items
export const getFirstMarked = (todoList: ITodoItem[]): number => {
	return indexOfItem(todoList, "state", TodoState.Marked);
}

// returns -1 if there are no marked items
export const getLastMarked = (todoList: ITodoItem[]): number => {
	return lastIndexOfItem(todoList, "state", TodoState.Marked);
}

export const firstReady = (todoList: ITodoItem[]): number => {
	const firstUnmarked = getFirstUnmarked(todoList);
	const firstMarked = getFirstMarked(todoList);
	if(firstUnmarked === -1 && firstMarked === -1 ) {
		return -1;
	} else if (firstUnmarked !== -1 && firstMarked === -1) {
		return firstUnmarked;
	} else if (firstUnmarked === -1 && firstMarked !== -1) {
		return firstMarked;
	} else {
		return Math.min(firstUnmarked, firstMarked);
	}
}