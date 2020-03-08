import { constructNewTodoItem, ITodoItem, TodoState } from "./todoItem";

export const conductFocus = (todoList: ITodoItem[], cmwtd: string, response: any): any => {
	// return w/o affecting state if focus mode cannot be entered
	if(todoList.length === 0 || cmwtd === "") {
		return [todoList, cmwtd];
	}
	const workLeft: string = response.workLeft; // this will be either 'y' or 'n'
	if(workLeft === 'y') {
		[todoList, cmwtd] = duplicateCMWTD(todoList, cmwtd);
	}
	[todoList, cmwtd] = markCMWTDdone(todoList, cmwtd);
	return [todoList, cmwtd];
};

export const markCMWTDdone = (todoList: ITodoItem[], cmwtd: string): any => {
	// note: since cmwtd is current saved as a string, string lookup
	// of todo items is the way to find the cmwtd in the todoItem list
	let searching = true;
	let i = 0;
	while(searching) {
		// find an item that matches the header text of the
		// current-most-want-to-do AND hasn't been completed yet
		if(todoList[i].header === cmwtd && todoList[i].state !== TodoState.Completed) {
			todoList[i].state = TodoState.Completed;
			searching = false;
		}
		i = i+1;
		// issue: Dev adds out of bounds check for markCMWTDdone #201
		// issue: Dev implements reset of CMWTD item #171
	}
	return [todoList, cmwtd];
}

export const duplicateCMWTD = (todoList: ITodoItem[], cmwtd: string): any => {
	const newItem: ITodoItem = constructNewTodoItem(
		cmwtd, "")
	todoList.push(newItem);
	return [todoList, cmwtd];
}