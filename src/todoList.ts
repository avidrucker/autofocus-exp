import { INumberedItem } from "./numberedItem";
import {
  getMark,
  ITodoItem,
  stringifyTodoItem,
  TodoState,
  undot
} from "./todoItem";
import { getMinFrom0Up, isEmpty } from "./util";

export const indexOfItem = (list: any[], attr: any, val: any): number => {
  return list.map(e => e[attr]).indexOf(val);
};

export const lastIndexOfItem = (list: any[], attr: any, val: any): number => {
  return list.map(e => e[attr]).lastIndexOf(val);
};

export const itemExists = (list: any[], attr: any, val: any): boolean => {
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
