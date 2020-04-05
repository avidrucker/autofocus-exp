import { ITodoItem, setState, TodoState } from "./todoItem";
import {
  itemExists,
  getLastMarked,
  getLastUnmarked,
  getFirstUnmarked,
  indexOfItemAfter,
  indexOfItem
} from "./todoList";
import { isEmpty } from "./util";
import { INumberedItem } from "./numberedItem";

export const markFirstUnmarkedIfExists = (
  todoList: ITodoItem[]
): ITodoItem[] => {
  if (
    itemExists(todoList, "state", TodoState.Unmarked) &&
    !itemExists(todoList, "state", TodoState.Marked)
  ) {
    const i = getFirstUnmarked(todoList);
    todoList[i] = markItem(todoList[i]);
  }
  return todoList;
};

// issue: Architect decides how to manage todo items in backend #108
// issue: Architect reviews for opportunity to make DRY, SOLID #299
export const setupReview = (todoList: ITodoItem[]): ITodoItem[] => {
  // short-circuit if the list is empty OR if there are marked items already
  if (isEmpty(todoList) || itemExists(todoList, "state", TodoState.Marked)) {
    return todoList;
  }

  // if there are no marked items AND any unmarked items, the first unmarked item becomes marked
  todoList = markFirstUnmarkedIfExists(todoList);

  return todoList;
};

// issue: Architect decides how to manage todo items in backend #108
const markItem = (i: ITodoItem): ITodoItem => {
  return setState(i, TodoState.Marked);
};

export const getLastDoneIndex = (
  todoList: ITodoItem[],
  lastDone: string
): number => {
  // short-circuit
  if (lastDone === "") {
    return -1;
  }
  // it needs have a string value of lastDone && it needs have a todostatus of completed
  return todoList.findIndex(
    x => x.header === lastDone && x.state === TodoState.Completed
  );
};

const getNextItemOfStateAfterIndex = (
  todoList: ITodoItem[],
  state: TodoState,
  i: number
): number => {
  // short-circuit
  if (todoList.length === 0) {
    return -1;
  }

  return indexOfItemAfter(todoList, "state", state, i);
};

// issue: Dev refactors determineReviewStart into FP style #372
// currently this code is declarative/imperative
export const determineReviewStart = (
  todoList: ITodoItem[],
  lastDone: string
): number => {
  let reviewStart = -1;
  const lastDoneIndex = getLastDoneIndex(todoList, lastDone);
  // firstly, we must decide from where to start reviewing
  // action 1: see if there are any reviewable items after the lastDone item
  if (lastDoneIndex !== -1) {
    // start reviews after lastDoneIndex if possible,
    // if not, then start reviews from lastMarked
    // ask, are there reviewable items after the last done item?
    if (getLastUnmarked(todoList) > lastDoneIndex) {
      // we review starting from the lastUnmarkedIndex
      reviewStart = getNextItemOfStateAfterIndex(
        todoList,
        TodoState.Unmarked,
        lastDoneIndex
      );
    }
  } else {
    if (itemExists(todoList, "state", TodoState.Marked)) {
      // see if reviews are possible after lastMarked
      reviewStart = getLastMarked(todoList);
    } else {
      // do nothing for now, though an warning should be thrown to user
    }
  }
  return reviewStart;
};

export const numberAndSlice = (
  todoList: ITodoItem[],
  reviewStart: number
): INumberedItem[] => {
  return todoList.map((x, i) => ({ item: x, index: i })).slice(reviewStart);
};

// consider a sample list `[x] [o] [ ]`
// isssue: Dev refactors conductAllReviews() to be modular and atomic #371
export const conductAllReviews = (
  todoList: ITodoItem[],
  lastDone: string,
  answers: string[]
): ITodoItem[] => {
  // get a subset of reviewable items (ie. the last chunk
  // of a list that follows the either the last done item if it exists,
  // otherwise the last marked item).
  const reviewStart = determineReviewStart(todoList, lastDone);
  // slice the list from the first reviewable item, and number them all
  let subsetList: INumberedItem[] = numberAndSlice(todoList, reviewStart);
  // filter out the non-reviewable items
  let reviewables = subsetList.filter(
    x => x["item"]["state"] === TodoState.Unmarked
  );

  // get the answers from somewhere (eg. user) & review all the reviewable items
  reviewables = reviewables.map((x, i) => conductReviewNum(x, answers[i]));

  // now, rebuild the subset list, substituting back in the reviewed items
  for (let i = 0; i < reviewables.length; i++) {
    // find item with index of  in subset list
    // if(indexOfItem(subsetList, 'index', reviewables[i].index) !== -1) // guard in-case
    subsetList[indexOfItem(subsetList, "index", reviewables[i].index)] =
      reviewables[i];
  }

  // next, we will convert the subset list of INumberedItems back to ITodoItems
  const reviewedSubset: ITodoItem[] = subsetList.map(x => ({
    header: x.item.header,
    state: x.item.state
  }));
  // and lastly, we will put the two sections of the original list back together
  const firstPart = todoList.slice(0, reviewStart);
  // return the reviewed list
  return firstPart.concat(reviewedSubset);
};

export const conductReview = (i: ITodoItem, answer: string): ITodoItem => {
  // FVP step 2: user story: User is asked to answer yes, no, or quit per review item #170
  if (answer === "y") {
    i = markItem(i);
  }
  return i;
};

export const conductReviewNum = (
  i: INumberedItem,
  answer: string
): INumberedItem => {
  // FVP step 2: user story: User is asked to answer yes, no, or quit per review item #170
  if (answer === "y") {
    i = { item: markItem(i.item), index: i.index };
  }
  return i;
};

// ready to review (for a list) means that:
// 1. there is at least 1 unmarked item AND
// ~~there are multiple ready items~~ <-- this by itself is wrong
// 2. If there are any marked items,
// the list has more unmarked after the last marked item
export const readyToReview = (todoList: ITodoItem[]): boolean =>
  itemExists(todoList, "state", TodoState.Unmarked) &&
  !(
    itemExists(todoList, "state", TodoState.Marked) &&
    getLastMarked(todoList) > getLastUnmarked(todoList)
  );
