import { expect } from 'chai';

import { conductFocus } from '../src/focus';
import { getLastMarked } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList } from '../src/todoList';

// issue: Dev resolves bug where completed todo items leave stale CMWTD #218

describe('Focus Mode', ()=> {
	describe('Entering focus mode', ()=> {
		it('when there are no todo items does not affect the todo list or cmwtd', () => {
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			[todoList, cmwtd] = conductFocus(todoList, cmwtd, {workLeft: 'y'}); // "There are no todo items."
			expect(todoList.length).equals(0);
			expect(cmwtd).equals("");
		});

		it('when there are no marked items doesn\'t affect the todo list of cmwtd', () => {
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			const item1: ITodoItem = constructNewTodoItem("apple");
			todoList = addTodoToList(todoList,item1);
			[todoList, cmwtd] = conductFocus(todoList, cmwtd, {workLeft: 'y'}); // "The CMWTD has not been set."
			expect(todoList.length).equals(1);
			expect(cmwtd).equals("");
		})
	});

	describe('Finding marked todos', () => {
		it('returns the last marked item', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[0].state = TodoState.Marked;
			todoList[1].state = TodoState.Marked;
			expect(getLastMarked(todoList)).equals(1);
		})

		it('returns -1 when there are no todos', () => {
			const todoList: ITodoItem[] = [];
			expect(getLastMarked(todoList)).equals(-1);
		});

		it('returns -1 index when there are no marked todos', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			expect(getLastMarked(todoList)).equals(-1);
		});

		it('when there are both marked and unmarked items, returns the marked item', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[0].state = TodoState.Marked;
			todoList[1].state = TodoState.Unmarked;
			expect(getLastMarked(todoList)).equals(0);
		})
	});
});