import { isReady, ITodoItem, TodoState } from "./todoItem";
import { firstReady, itemExists } from "./todoList";

// issue: Architect decides how to manage todo items in backend #108
export const setupReview = (todoList: ITodoItem[], cmwtd: string): any => {
	const readyTodo = firstReady(todoList); // short circuit func if 0 todos OR not ready to review
	if(todoList.length === 0 || readyTodo === -1) {
		return [todoList, cmwtd];
	}
	if(firstReady(todoList) !== -1) {
		// FVP step 1: dot the first ready todo item (the first non-complete, non-archived item)
		todoList[readyTodo].state = TodoState.Marked;
	}
	if(cmwtd === "" || cmwtd === null) {
		cmwtd = todoList[readyTodo].header; // CMWTD is initialized to first ready todo item if unset
	}
	return [todoList, cmwtd];
}

// issue: Dev refactors conductReviews #215
export const conductReviews = (todoList: ITodoItem[], cmwtd: string, answers: string[]): any => {
	if(todoList.length === 0 || todoList.length === 1) {
		return [todoList, cmwtd];
	}
	// FVP step 2: user story: User is asked to answer yes, no, or quit per review item #170
	for(let i = 0; i < todoList.length - 1; i++) {
		const next = todoList[i+1].header;
		const ans = answers[i];
		if(ans === 'y') {
			todoList[i+1].state = TodoState.Marked;
			cmwtd = next; // issue: Architect decides how to manage todo items in backend #108
		}
		if(ans === 'n') {
			// do nothing, and pass
		}
		if(ans === 'q') {
			break;
		}
	}
	return [todoList, cmwtd];
}

// ready to review (for a list) means that:
// - there is at least 1 unmarked item AND
// - there are multiple ready items 
export const readyToReview = (todoList: ITodoItem[]): boolean =>
	itemExists(todoList, "state", TodoState.Unmarked) &&
		(todoList.filter(x => isReady(x)).length > 1 || 
		itemExists(todoList, "state", TodoState.Marked))