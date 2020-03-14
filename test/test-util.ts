import { expect } from 'chai';

import { constructNewTodoItem, ITodoItem, setState, TodoState } from '../src/todoItem';
import { addTodoToList } from '../src/todoList';

// test constants
export const FRUITS = ["apple", "banana", "cherry"];

export const expectOneMarkedApple = (todoList: ITodoItem[], cmwtd: string): void => {
	expect(todoList.length).equals(1);
	expect(todoList[0].state).equals(TodoState.Marked);
	expect(cmwtd).equals(FRUITS[0]);
}

export const throwBadInputError = () => {
	throw new Error("Bad input error thrown");
}

export const makeNItemArray = (n: number = 0): ITodoItem[] => {
	if(n < 0) {
		throwBadInputError();
	}
	let todoList: ITodoItem[] = [];
	for(let i = 0; i < n; i++) {
		todoList = addTodoToList(
			todoList,
			constructNewTodoItem(FRUITS[i % FRUITS.length])
			);
	}
	return todoList;
}

export const markAllAs = (todoList: ITodoItem[], stateIn: TodoState): ITodoItem[] => {
	return todoList.map(x => setState(x, stateIn));
}