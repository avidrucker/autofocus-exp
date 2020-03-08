import { ITodoItem, TodoState } from "./todoItem";
import { indexOfItem, itemExists } from "./todoList";

// note: either indicies could be -1...
export const getFirstReadyTodo = (todoList: ITodoItem[]): number => {
	const firstUnmarkedIndex = indexOfItem(todoList, "state", TodoState.Unmarked);
	const firstMarkedIndex = indexOfItem(todoList, "state", TodoState.Marked);
	if (firstUnmarkedIndex === -1 && firstMarkedIndex === -1) {
		return -1;
	}
	if (firstUnmarkedIndex === -1 && firstMarkedIndex !== -1) {
		return firstMarkedIndex;
	} else if (firstMarkedIndex === -1 && firstUnmarkedIndex !== -1) {
		return firstUnmarkedIndex;
	} else {
		return Math.min(firstMarkedIndex, firstUnmarkedIndex)
	}
}

export const setupReview = (todoList: ITodoItem[], cmwtd: string): any => {
	const readyTodo = getFirstReadyTodo(todoList);
	// short circuit func if there are no todos OR no ready to review todos
	if(todoList.length === 0 || readyTodo === -1) {
		return [todoList, cmwtd];
	}
	// FVP step 1: dot the first ready todo item (the first non-complete, non-archived item)
	todoList[readyTodo].state = TodoState.Marked; // issue: Dev fixes issue where first item is perma-marked #116
	// issue: Architect decides how to manage todo items in backend #108
	if(cmwtd === "" || cmwtd === null) {
		cmwtd = todoList[readyTodo].header; // CMWTD is initialized to first ready todo item if unset
	}
	return [todoList, cmwtd];
}

// issue: Dev refactors conductReviews #215
export const conductReviews = (todoList: ITodoItem[], cmwtd: string, answers: string[]): any => {
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

export const readyToReview = (todoList: ITodoItem[]): boolean => {
	const containsUnmarked = itemExists(todoList, "state", TodoState.Unmarked);
	const containsMarked = itemExists(todoList, "state", TodoState.Marked);
	return containsMarked || containsUnmarked;
}