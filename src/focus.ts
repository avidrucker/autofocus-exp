import { getLastMarked } from "./review";
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
	const lastMarked = getLastMarked(todoList); // 1. find last marked item (this should match cmwtd)
	todoList[lastMarked].state = TodoState.Completed; // 2. set it to completed
	[todoList, cmwtd] = updateCMWTD(todoList, cmwtd); // 3. update cmwtd
	return [todoList, cmwtd];
}

export const duplicateCMWTD = (todoList: ITodoItem[], cmwtd: string): any => {
	const newItem: ITodoItem = constructNewTodoItem(
		cmwtd, "")
	todoList.push(newItem);
	return [todoList, cmwtd];
}

// issue: Dev resolves bug where completed todo items leave stale CMWTD #218, needs testing
export const updateCMWTD = (todoList: ITodoItem[], cmwtd: string): any => {
	const lastIndex = getLastMarked(todoList);
	if(lastIndex !== -1) {
		cmwtd = todoList[lastIndex].header;
	} else {
		cmwtd = ""; // resets CMWTD
	}
	return [todoList, cmwtd];
}