import { INumberedItem } from "./numberedItem";
import { constructNewTodoItem, isReady, ITodoItem, setState, TodoState } from "./todoItem";
import { firstReady, itemExists, numListToTodoList } from "./todoList";
import { isDefinedString } from "./util";

// issue: Architect decides how to manage todo items in backend #108
// issue: Dev refactors setupReview to be modular, atomic #278
export const setupReview = (todoList: ITodoItem[], cmwtd: string): any => {
	let readyTodo = -1;
	readyTodo = firstReady(todoList); // short circuit func if 0 todos OR not ready to review
	if(todoList.length === 0 || readyTodo === -1) {
		return [todoList, cmwtd];
	}
	// issue: Dev confirms via test that setupReview doesn't increase dots on already dotted lists #276
	if(readyTodo !== -1) {
		// FVP step 1: dot the first ready todo item (the first non-complete, non-archived item)
		todoList[readyTodo].state = TodoState.Marked;

		if(cmwtd === "" || cmwtd === null) {
			// issue: Dev confirms via test that CMWTD is initialized to last marked item #277
			cmwtd = todoList[readyTodo].header; // CMWTD is initialized to first ready todo item if unset
		}
	}
	return [todoList, cmwtd];
}

// add original index, chop off at reviewable
// section, & filter out completed items
export const enhanceSliceFilter = (todoList: ITodoItem[], start: number): INumberedItem[] => {
	return todoList.map((x, i) => ({item: x, index: i}))
		.slice(start)
		.filter(y => y.item.state !== TodoState.Completed);
}

// issue: Dev writes test cases for getReviewableList #281
// issue: Dev writes test to confirm where reviewable lists start #280
export const getReviewableList = (todoList: ITodoItem[], cmwtd: string, lastDone: string): INumberedItem[] => {
	let firstIndex = 0;
	if(isDefinedString(lastDone)) {
		// issue: Dev implements UUID #279
		firstIndex = todoList.map(x => x.header).indexOf(lastDone); // issue: Dev writes tests to confirm that unique todos (via UUID) work as expected #285
	} else if (isDefinedString(cmwtd)) {
		firstIndex = todoList.map(x => x.header).indexOf(cmwtd); // issue: Dev writes tests to confirm that unique todos (via UUID) work as expected #285
	} else {
		firstIndex = todoList.map(x => x.state).indexOf(TodoState.Unmarked);
	}
	if(firstIndex === -1) {
		return [];
	}
	return enhanceSliceFilter(todoList, firstIndex + 1); // add original index here & also filter out any completed items
}

// issue: Dev refactors to remove getNonReviewableList #295
export const getNonReviewableList = (todoList: ITodoItem[], cmwtd: string, lastDone: string): ITodoItem[] => {
	let firstIndex = 0;
	if(isDefinedString(lastDone)) {
		// issue: Dev implements UUID #279
		firstIndex = todoList.map(x => x.header).indexOf(lastDone);
	} else if (isDefinedString(cmwtd)) {
		firstIndex = todoList.map(x => x.header).indexOf(cmwtd);
	} else {
		firstIndex = todoList.map(x => x.state).indexOf(TodoState.Unmarked);
	}
	if(firstIndex === -1) {
		return [];
	}
	return todoList.slice(0, firstIndex + 1);
}

// issue: Dev assess reviewAndRebuild to refactor, make DRY, SOLID #297
export const reviewAndRebuild = (todoList: ITodoItem[], cmwtd: string, lastDone: string, answers: string[]): any => {
	const reviewableList = getReviewableList(todoList, cmwtd, lastDone);
	const nonReviewableList = getNonReviewableList(todoList, cmwtd, lastDone); // issue: Dev refactors to remove getNonReviewableList #295
	let tempReviewedList = [];
	let tempCmwtd = "";
	[tempReviewedList, tempCmwtd] = conductReviews(numListToTodoList(reviewableList), cmwtd, answers);
	const reviewedListReverse: ITodoItem[] = (JSON.parse(JSON.stringify(tempReviewedList))).reverse();
	let newList: ITodoItem[] = [];
	newList = newList.concat(nonReviewableList);
	for(let i = nonReviewableList.length; i < todoList.length; i++) {
		if(todoList[i].state === TodoState.Completed) {
			// console.log(`${todoList[i].header} is COMPLETE, leaving as is`);
			newList.push(constructNewTodoItem(
				todoList[i].header,"",TodoState.Completed)); // issue: Dev implements dup todo item func that preserves state #296
		} else {
			// console.log(`rebuilding at index ${i}: '${todoList[i].header}'`);
			newList.push(reviewedListReverse.pop()!);
		}
	}
	[todoList, cmwtd] = [JSON.parse(JSON.stringify(newList)), tempCmwtd];
	return [todoList, cmwtd];
}

// breaks down functionality of conduct reviews epic (working title)
// to review only the sections of lists that are reviewable, & then
// to stitch back up the entire todo item list after reviewing
export const conductReviewsEpic = (todoList: ITodoItem[], cmwtd: string, lastDone: string, answers: string[]): any => {
	const reviewableList = getReviewableList(todoList, cmwtd, lastDone);
	if(todoList.length === 0 && reviewableList.length === 0) {
		return [todoList, cmwtd]; // short circuit when no items are reviewable
	}
	if(reviewableList.length !== 0) {
		return reviewAndRebuild(todoList, cmwtd, lastDone, answers);
	}
	if(todoList.length !== 0) {
		return conductReviews(todoList, cmwtd, answers);
	}
}

const markItem = (i: ITodoItem, cmwtd: string): any => {
	i = setState(i, TodoState.Marked);
	cmwtd = i.header; // issue: Architect decides how to manage todo items in backend #108
	return [i, cmwtd];
}

export const applyAnswers = (todoList: ITodoItem[], cmwtd: string, answers: string[]): any => {
	todoList
		.map((x, i) => answers[i] === 'y' ?
		[todoList[i], cmwtd] = markItem(x, cmwtd) :
		[todoList[i], cmwtd] = [todoList[i], cmwtd]);

	return [todoList, cmwtd];
}

// issue: Dev writes test cases for conductReviews #282
// issue: Dev refactors conductReviews #215
export const conductReviews = (	todoList: ITodoItem[], cmwtd: string, answers: string[]): any => {
	if(todoList.length === 0) {
		return [todoList, cmwtd];
	}

	// FVP step 2: user story: User is asked to answer yes, no, or quit per review item #170
	[todoList, cmwtd] = applyAnswers(todoList, cmwtd, answers);

	return [todoList, cmwtd];
}

// ready to review (for a list) means that:
// - there is at least 1 unmarked item AND
// - there are multiple ready items 
export const readyToReview = (todoList: ITodoItem[]): boolean =>
	itemExists(todoList, "state", TodoState.Unmarked) &&
		(todoList.filter(x => isReady(x)).length > 1 || 
		itemExists(todoList, "state", TodoState.Marked))