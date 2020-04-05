import { constructNewTodoItem, ITodoItem, TodoState } from "./todoItem";
import { getLastMarked, itemExists, getCMWTD } from "./todoList";
import { isEmpty } from "./util";

// issue: Dev refactors out any type from function returns #374
export const conductFocus = (
  todoList: ITodoItem[],
  lastDone: string,
  response: any
): [ITodoItem[], string] => {
  // return w/o affecting state if focus mode cannot be entered
  if (isEmpty(todoList) || !itemExists(todoList, "state", TodoState.Marked)) {
    return [todoList, lastDone]; // no focus exit
  }
  const workLeft: string = response.workLeft; // this will be either 'y' or 'n'
  if (workLeft === "y") {
    todoList = duplicateLastMarked(todoList);
  }
  [todoList, lastDone] = markLastMarkedComplete(todoList, lastDone);
  return [todoList, lastDone];
};

export const markLastMarkedComplete = (
  todoList: ITodoItem[],
  lastDone: string
): [ITodoItem[], string] => {
  lastDone = getCMWTD(todoList); // 1. update last done
  todoList[getLastMarked(todoList)].state = TodoState.Completed; // 2. set it to completed
  return [todoList, lastDone];
};

export const duplicateLastMarked = (todoList: ITodoItem[]): ITodoItem[] => {
  const newItem: ITodoItem = constructNewTodoItem(getCMWTD(todoList));
  todoList.push(newItem);
  return todoList;
};

// issue: Architect determines whether to use readyToFocus() #275
export const readyToFocus = (todoList: ITodoItem[]): boolean => {
  return itemExists(todoList, "state", TodoState.Marked);
};
