import { INumberedItem } from "./numberedItem";
import {
  getMark,
  ITodoItem,
  stringifyTodoItem,
  TodoState,
  undot
} from "./todoItem";
import { getMinFrom0Up, isEmpty } from "./util";

// issue: Dev refactors out any type from function returns #374
export const indexOfItem = (
  list: any[],
  attr: string,
  val: TodoState
): number => {
  return list.map(e => e[attr]).indexOf(val);
};

// issue: Dev refactors out any type from function returns #374
export const indexOfItemAfter = (
  list: any[],
  attr: string,
  val: TodoState,
  from: number
): number => {
  return list.map(e => e[attr]).indexOf(val, from);
};

// issue: Dev refactors out any type from function returns #374
export const lastIndexOfItem = (
  list: any[],
  attr: string,
  val: TodoState
): number => {
  return list.map(e => e[attr]).lastIndexOf(val);
};

export const itemExists = (
  list: ITodoItem[],
  attr: string,
  val: TodoState
): boolean => {
  return indexOfItem(list, attr, val) !== -1;
};

export const makePrintableTodoItemList = (todoList: ITodoItem[]): string => {
  let temp: string = "";
  if (isEmpty(todoList)) {
    temp = "There are no todo items to print.";
  } else {
    temp = todoList.map(x => stringifyTodoItem(x)).join("\n");
  }
  return temp;
};

export const listToMarks = (todoList: ITodoItem[]): string => {
  return todoList.map(x => getMark[x.state]()).join(" ");
};

// note: this is useful for logging purposes only, marked for deletion
export const numListToMarks = (todoList: INumberedItem[]): string => {
  return todoList.map((x, i) => `[${i}: ${getMark[x.item.state]()}]`).join(" ");
};

export const numListToTodoList = (todoList: INumberedItem[]): ITodoItem[] => {
  return todoList.map(x => x.item);
};

export const addTodoToList = (
  todoList: ITodoItem[],
  newTodoItem: ITodoItem
): ITodoItem[] => {
  todoList.push(newTodoItem);
  return todoList;
};

// returns -1 if there are no unmarked items
export const getFirstUnmarked = (todoList: ITodoItem[]): number => {
  return indexOfItem(todoList, "state", TodoState.Unmarked);
};

// returns -1 if there are no marked items
export const getFirstMarked = (todoList: ITodoItem[]): number => {
  return indexOfItem(todoList, "state", TodoState.Marked);
};

// returns -1 if there are no marked items
export const getLastMarked = (todoList: ITodoItem[]): number => {
  return lastIndexOfItem(todoList, "state", TodoState.Marked);
};

// returns -1 if there are no unmarked items
export const getLastUnmarked = (todoList: ITodoItem[]): number => {
  return lastIndexOfItem(todoList, "state", TodoState.Unmarked);
};

export const firstReady = (todoList: ITodoItem[]): number => {
  const firstUnmarked = getFirstUnmarked(todoList);
  const firstMarked = getFirstMarked(todoList);
  return getMinFrom0Up(firstUnmarked, firstMarked);
};

export const undotAll = (todoList: ITodoItem[]): ITodoItem[] => {
  return todoList.map(x => undot(x));
};

// "getLastMarkedHeader"
export const getCMWTD = (todoList: ITodoItem[]): string => {
  // short-circuit with empty string when there is no CMWTD
  if (!itemExists(todoList, "state", TodoState.Marked)) {
    return "";
  }
  return todoList[getLastMarked(todoList)].header;
};
