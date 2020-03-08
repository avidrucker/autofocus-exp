import { getMark, ITodoItem, stringifyTodoItem } from "./todoItem";

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