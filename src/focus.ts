import { constructNewTodoItem, ITodoItem, TodoState } from "./todoItem";
import { getLastMarked, itemExists } from "./todoList";

export const conductFocus = (todoList: ITodoItem[], cmwtd: string, lastDone: string, response: any): any => {
	// return w/o affecting state if focus mode cannot be entered
	if(todoList.length === 0 || cmwtd === "") {
		return [todoList, cmwtd, lastDone];
	}
	const workLeft: string = response.workLeft; // this will be either 'y' or 'n'
	if(workLeft === 'y') {
		[todoList, cmwtd] = duplicateCMWTD(todoList, cmwtd);
	}
	[todoList, cmwtd, lastDone] = markCMWTDdone(todoList, cmwtd, lastDone);
	return [todoList, cmwtd, lastDone];
};

export const markCMWTDdone = (todoList: ITodoItem[], cmwtd: string, lastDone: string): any => {
	const lastMarked = getLastMarked(todoList); // 1. find last marked item (this should match cmwtd)
	todoList[lastMarked].state = TodoState.Completed; // 2. set it to completed
	[todoList, cmwtd, lastDone] = updateCMWTD(todoList, cmwtd, lastDone); // 3. update cmwtd
	return [todoList, cmwtd, lastDone];
}

export const duplicateCMWTD = (todoList: ITodoItem[], cmwtd: string): any => {
	const newItem: ITodoItem = constructNewTodoItem(
		cmwtd, "")
	todoList.push(newItem);
	return [todoList, cmwtd];
}

// issue: Dev resolves bug where completed todo items leave stale CMWTD #218, needs testing
export const updateCMWTD = (todoList: ITodoItem[], cmwtd: string, lastDone: string): any => {
	const lastIndex = getLastMarked(todoList);
	if(lastIndex !== -1) {
		// issue: Dev refactors code to be more DRY #286
		lastDone = String(cmwtd);
		cmwtd = todoList[lastIndex].header;
	} else {
		// issue: Dev refactors code to be more DRY #286
		lastDone = String(cmwtd);
		cmwtd = ""; // resets CMWTD
	}
	return [todoList, cmwtd, lastDone];
}

// issue: Architect determines whether to use readyToFocus() #275
export const readyToFocus = (todoList: ITodoItem[], cmwtd: string): boolean => {
	return cmwtd !== "" && itemExists(todoList, "state", TodoState.Marked);
}