import { constructNewTodoItem, ITodoItem, TodoState } from "./todoItem";
import { getLastMarked, itemExists, getCMWTD } from "./todoList";
import { isEmpty } from "./util";

export const conductFocus = (
  todoList: ITodoItem[],
  lastDone: string,
  response: any
): any => {
  // return w/o affecting state if focus mode cannot be entered
  if (isEmpty(todoList) || !itemExists(todoList, "state", TodoState.Marked)) {
    return [todoList, lastDone];
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
): any => {
  [todoList, lastDone] = updateLastDone(todoList, lastDone); // 2. update last done
  todoList[getLastMarked(todoList)].state = TodoState.Completed; // 3. set it to completed
  return [todoList, lastDone];
};

export const duplicateLastMarked = (todoList: ITodoItem[]): any => {
  const newItem: ITodoItem = constructNewTodoItem(getCMWTD(todoList), "");
  todoList.push(newItem);
  return todoList;
};

// todo: merge back into parent function, since it is only use in one place
export const updateLastDone = (
  todoList: ITodoItem[],
  lastDone: string
): any => {
  lastDone = getCMWTD(todoList);
  return [todoList, lastDone];
};

// issue: Architect determines whether to use readyToFocus() #275
export const readyToFocus = (todoList: ITodoItem[]): boolean => {
  return itemExists(todoList, "state", TodoState.Marked);
};
