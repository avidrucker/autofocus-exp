import { INumberedItem } from "./numberedItem";
import {
  constructNewTodoItem,
  isReady,
  ITodoItem,
  setState,
  TodoState
} from "./todoItem";
import { itemExists, numListToTodoList, getLastMarked, getLastUnmarked, getFirstUnmarked } from "./todoList";
import { isDefinedString, isEmpty } from "./util";

export const markFirstUnmarkedIfExists = (todoList: ITodoItem[]): any => {
	if(itemExists(todoList, "state", TodoState.Unmarked) && !itemExists(todoList, "state", TodoState.Marked)) {
		const i = getFirstUnmarked(todoList);
		todoList[i] = markItem(todoList[i]);
	}
	return todoList;
}

// issue: Architect decides how to manage todo items in backend #108
// issue: Architect reviews for opportunity to make DRY, SOLID #299
export const setupReview = (todoList: ITodoItem[]): any => {
	// short-circuit if the list is empty OR if there are marked items already
  if (isEmpty(todoList) || itemExists(todoList, "state", TodoState.Marked)) {
    return todoList;
  }
	
	// if there are no marked items AND any unmarked items, the first unmarked item becomes marked
	todoList = markFirstUnmarkedIfExists(todoList);
  
  return todoList;
};

// add original index, chop off at reviewable
// section, & filter out completed items
export const enhanceSliceFilter = (
  todoList: ITodoItem[],
  start: number
): INumberedItem[] => {
  return todoList
    .map((x, i) => ({ item: x, index: i }))
    .slice(start)
    .filter(y => y.item.state !== TodoState.Completed);
};

// issue: Dev writes test cases for getReviewableList #281
// issue: Dev writes test to confirm where reviewable lists start #280
// issue: Architect reviews for opportunity to make DRY, SOLID #299
// issue: Dev fixes bug where review question count & content are correct #344
export const getReviewableList = (
  todoList: ITodoItem[],
  lastDone: string
): INumberedItem[] => {
  let firstIndex = 0;
  if (isDefinedString(lastDone)) {
    // issue: Dev implements UUID #279
    firstIndex = todoList.map(x => x.header).indexOf(lastDone); // issue: Dev writes tests to confirm that unique todos (via UUID) work as expected #285
  } else if (itemExists(todoList, "state", TodoState.Marked)) {
    firstIndex = getLastMarked(todoList); // issue: Dev writes tests to confirm that unique todos (via UUID) work as expected #285
  } else {
    firstIndex = todoList.map(x => x.state).indexOf(TodoState.Unmarked);
  }
  if (firstIndex === -1) {
    return [];
  }
  return enhanceSliceFilter(todoList, firstIndex + 1); // add original index here & also filter out any completed items
};

// issue: Dev refactors to remove getNonReviewableList #295
export const getNonReviewableList = (
  todoList: ITodoItem[],
  lastDone: string
): ITodoItem[] => {
  let firstIndex = 0;
  if (isDefinedString(lastDone)) {
    // issue: Dev implements UUID #279
    firstIndex = todoList.map(x => x.header).indexOf(lastDone);
  } else if (itemExists(todoList, "state", TodoState.Marked)) {
    firstIndex = getLastMarked(todoList);
  } else {
    firstIndex = todoList.map(x => x.state).indexOf(TodoState.Unmarked);
  }
  if (firstIndex === -1) {
    return [];
  }
  return todoList.slice(0, firstIndex + 1);
};

// issue: Architect reviews for opportunity to make DRY, SOLID #299
// issue: Dev assess reviewAndRebuild to refactor, make DRY, SOLID #297
export const reviewAndRebuild = (
  todoList: ITodoItem[],
  lastDone: string,
  answers: string[]
): any => {
  const reviewableList = getReviewableList(todoList, lastDone);
  const nonReviewableList = getNonReviewableList(todoList, lastDone); // issue: Dev refactors to remove getNonReviewableList #295
  let tempReviewedList = [];
  tempReviewedList = conductReviews(
    numListToTodoList(reviewableList),
    answers
  );
  const reviewedListReverse: ITodoItem[] = JSON.parse(
    JSON.stringify(tempReviewedList)
  ).reverse();
  let newList: ITodoItem[] = [];
	newList = newList.concat(nonReviewableList);
	// todo: refactor out for loop
  for (let i = nonReviewableList.length; i < todoList.length; i++) {
    if (todoList[i].state === TodoState.Completed) {
      // console.log(`${todoList[i].header} is COMPLETE, leaving as is`);
      newList.push(
        constructNewTodoItem(todoList[i].header, "", TodoState.Completed)
      ); // issue: Dev implements dup todo item func that preserves state #296
    } else {
      // console.log(`rebuilding at index ${i}: '${todoList[i].header}'`);
      newList.push(reviewedListReverse.pop()!);
    }
  }
  todoList = JSON.parse(JSON.stringify(newList));
  return todoList;
};

// breaks down functionality of conduct reviews epic (working title)
// to review only the sections of lists that are reviewable, & then
// to stitch back up the entire todo item list after reviewing
export const conductReviewsEpic = (
  todoList: ITodoItem[],
  lastDone: string,
  answers: string[]
): any => {
  const reviewableList = getReviewableList(todoList, lastDone);
  if (isEmpty(todoList) || isEmpty(reviewableList)) {
    return todoList; // short circuit when no items are reviewable
  }
  if (!isEmpty(reviewableList)) {
    return reviewAndRebuild(todoList, lastDone, answers);
  }
  if (!isEmpty(todoList)) {
    return conductReviews(todoList, answers);
  }
};

// issue: Architect decides how to manage todo items in backend #108
const markItem = (i: ITodoItem): ITodoItem => {
  i = setState(i, TodoState.Marked);
  return i;
};

// todo: refactor to increase readability, consider FP approach
export const applyAnswers = (
  todoList: ITodoItem[],
  answers: string[]
): any => {
  todoList.map((x, i) =>
    answers[i] === "y"
      ? (todoList[i] = markItem(x))
      : (todoList[i] = todoList[i])
  );

  return todoList;
};

// issue: Dev writes test cases for conductReviews #282
// issue: Dev refactors conductReviews #215
export const conductReviews = (
  todoList: ITodoItem[],
  answers: string[]
): any => {
  if (isEmpty(todoList)) {
    return todoList;
  }

  // FVP step 2: user story: User is asked to answer yes, no, or quit per review item #170
  todoList = applyAnswers(todoList, answers);

  return todoList;
};

// ready to review (for a list) means that:
// 1. there is at least 1 unmarked item AND
// ~~there are multiple ready items~~ <-- this by itself is wrong
// 2. If there are any marked items,
// the list has more unmarked after the last marked item
export const readyToReview = (todoList: ITodoItem[]): boolean =>
	itemExists(todoList, "state", TodoState.Unmarked) &&
	!(itemExists(todoList, "state", TodoState.Marked) && getLastMarked(todoList) > getLastUnmarked(todoList));
