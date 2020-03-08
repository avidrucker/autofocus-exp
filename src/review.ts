import { isReady, ITodoItem, TodoState } from "./todoItem";
import { indexOfItem, itemExists, lastIndexOfItem } from "./todoList";

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

export const setupReview = (todoList: ITodoItem[], cmwtd: string): any => {
	const firstUnmarked = getFirstUnmarked(todoList);
	const firstMarked = getFirstMarked(todoList);
	// short circuit func if there are no todos OR no ready to review todos
	if(todoList.length === 0 || firstUnmarked === -1) {
		return [todoList, cmwtd];
	}
	// firstMarked is -1, firstUnmarked is 0 ==> mark Unmarked
	// firstMarked is 0, firstUnmarked is 1 ==> do nothing
	// firstMarked is 1, firstUnmarked is 0 ==> mark Unmarked
	if(firstMarked === -1 || (firstUnmarked < firstMarked)) {
		// FVP step 1: dot the first ready todo item (the first non-complete, non-archived item)
		todoList[firstUnmarked].state = TodoState.Marked; // issue: Dev fixes issue where first item is perma-marked #116
	}
	// issue: Architect decides how to manage todo items in backend #108
	if(cmwtd === "" || cmwtd === null) {
		cmwtd = todoList[firstUnmarked].header; // CMWTD is initialized to first ready todo item if unset
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

// ready to review (for a list) means that:
// - there is at least 1 unmarked item AND
// - there are multiple ready items 
export const readyToReview = (todoList: ITodoItem[]): boolean =>
	itemExists(todoList, "state", TodoState.Unmarked) &&
		todoList.filter(x => isReady(x)).length > 1