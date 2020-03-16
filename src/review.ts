import { isReady, ITodoItem, TodoState } from "./todoItem";
import { firstReady, itemExists } from "./todoList";

// issue: Architect decides how to manage todo items in backend #108
// todo: refactor to be modular, atomic, & composed
export const setupReview = (todoList: ITodoItem[], cmwtd: string): any => {
	let readyTodo = -1;
	readyTodo = firstReady(todoList); // short circuit func if 0 todos OR not ready to review
	if(todoList.length === 0 || readyTodo === -1) {
		return [todoList, cmwtd];
	}

	// todo: confirm that initial dotting does not occur if there are already dots (eg. see long e2e)
	if(firstReady(todoList) !== -1) {
		// FVP step 1: dot the first ready todo item (the first non-complete, non-archived item)
		todoList[readyTodo].state = TodoState.Marked;

		if(cmwtd === "" || cmwtd === null) {
			// todo: it should be that the CMWTD is initialized to the *last marked item*
			cmwtd = todoList[readyTodo].header; // CMWTD is initialized to first ready todo item if unset
		}
	}
	return [todoList, cmwtd];
}

// todo: make a user story (and test case) to confirm:
// "reviewable lists start from the first unmarked item after
// the lastDone item (if it exists), otherwise, after the cmwtd,
// otherwise from the first unmarked item"
export const getReviewableList = (todoList: ITodoItem[], cmwtd: string, lastDone: string): ITodoItem[] => {
	let firstIndex = 0;
	if(lastDone !== "" && lastDone !== null) {
		// todo: implement UUID to ensure correct item validation (rather than looking up by
		// non-unique strings)
		firstIndex = todoList.map(x => x.header).indexOf(lastDone); // todo: confirm that unique todos (via UUID) work as expected
	} else if (cmwtd !== "" && cmwtd !== null) {
		firstIndex = todoList.map(x => x.header).indexOf(cmwtd); // todo: confirm that unique todos (via UUID) work as expected
	} else {
		firstIndex = todoList.map(x => x.state).indexOf(TodoState.Unmarked);
	}
	if(firstIndex === -1) {
		return [];
	}
	return todoList.slice(firstIndex + 1);
}

export const getNonReviewableList = (todoList: ITodoItem[], cmwtd: string, lastDone: string): ITodoItem[] => {
	let firstIndex = 0;
	if(lastDone !== "" && lastDone !== null) {
		// todo: implement UUID to ensure correct item validation (rather than looking up by
		// non-unique strings)
		firstIndex = todoList.map(x => x.header).indexOf(lastDone);
	} else if (cmwtd !== "" && cmwtd !== null) {
		firstIndex = todoList.map(x => x.header).indexOf(cmwtd);
	} else {
		firstIndex = todoList.map(x => x.state).indexOf(TodoState.Unmarked);
	}
	if(firstIndex === -1) {
		return [];
	}
	return todoList.slice(0, firstIndex + 1);
}

// todo: break down functionality of conduct reviews epic (working title)
// to review only the sections of lists that are reviewable, & then
// to stitch back up the entire todo item list after reviewing
export const conductReviewsEpic = (todoList: ITodoItem[], cmwtd: string, lastDone: string, answers: string[]): any => {
	// todo: test usage of getReviewableList
	const reviewableList = getReviewableList(todoList, cmwtd, lastDone);
	if(reviewableList.length !== 0) {
		const nonReviewableList = getNonReviewableList(todoList, cmwtd, lastDone);
		[todoList, cmwtd] = conductReviews(reviewableList, cmwtd, answers);
		const reviewedList = JSON.parse(JSON.stringify(todoList));
		todoList = nonReviewableList.concat(reviewedList);
	} else {
		[todoList, cmwtd] = conductReviews(todoList, cmwtd, answers);
	}
	return [todoList, cmwtd];
}

// todo: conduct reviews function handles for mid-list items being completed (non-markable)
// issue: Dev refactors conductReviews #215
export const conductReviews = (	todoList: ITodoItem[], cmwtd: string, answers: string[]): any => {
	// todo: test for function run prevention guard occuring correctly for 2nd to last item being marked
	// todo: test for function run prevention guard occuring correctly for 2nd to last item being completed
	if(todoList.length === 0) {
		return [todoList, cmwtd];
	}
	if(todoList.length === 1) {
		if(answers[0] === 'y') {
			todoList[0].state = TodoState.Marked;
			cmwtd = todoList[0].header;
		}
	}
	if(todoList.length > 1) {
		// FVP step 2: user story: User is asked to answer yes, no, or quit per review item #170
		for(let i = 0; i < todoList.length; i++) {
			if(answers[i] === 'y') {
				todoList[i].state = TodoState.Marked;  // todo: simplify
				cmwtd = todoList[i].header; // issue: Architect decides how to manage todo items in backend #108
			}
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