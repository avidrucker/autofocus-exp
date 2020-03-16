import { expect } from 'chai';

import { conductFocus } from '../src/focus';
import { ITodoItem, TodoState } from '../src/todoItem';
import { getLastMarked } from '../src/todoList';
import { makeNItemArray, markAllAs } from '../unit/test-util';

describe('FOCUS MODE INTEGRATION TESTS', ()=> {
	describe('Entering focus mode', ()=> {
		it('when there 0 items does not affect the todo list, cmwtd, or lastDone', () => {
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			let lastDone = "";
			[todoList, cmwtd, lastDone] = conductFocus(todoList, cmwtd, lastDone, {workLeft: 'y'}); // "There are no todo items."
			expect(todoList.length).equals(0);
			expect(cmwtd).equals("");
			expect(lastDone).equals("");
		});

		it('when there are no marked items doesn\'t affect the todo list of cmwtd', () => {
			let todoList: ITodoItem[] = makeNItemArray(1);
			let cmwtd = "";
			let lastDone = "";
			[todoList, cmwtd, lastDone] = conductFocus(todoList, cmwtd, lastDone, {workLeft: 'y'}); // "The CMWTD has not been set."
			expect(todoList.length).equals(1);
			expect(cmwtd).equals("");
		})
	});

	// todo: test creation of duplicate todos from answering yes to workLeft
	
	describe('Finding marked todos', () => {
		it('returns the last marked item', () => {
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList = markAllAs(todoList, TodoState.Marked);
			expect(getLastMarked(todoList)).equals(1);
		})

		it('returns -1 when there are no todos', () => {
			const todoList: ITodoItem[] = [];
			expect(getLastMarked(todoList)).equals(-1);
		});

		it('returns -1 index when there are no marked todos', () => {
			const todoList: ITodoItem[] = makeNItemArray(2);
			expect(getLastMarked(todoList)).equals(-1);
		});

		it('when there are both marked and unmarked items, returns the marked item', () => {
			const todoList: ITodoItem[] = makeNItemArray(2);
			todoList[0].state = TodoState.Marked;
			todoList[1].state = TodoState.Unmarked;
			expect(getLastMarked(todoList)).equals(0);
		})
	});

	describe('Updating the CMWTD', () => {
		it('updates CMWTD from something to nothing', () => {
			let todoList: ITodoItem[] = makeNItemArray(1);
			let cmwtd = "apple";
			let lastDone = "";
			todoList[0].state = TodoState.Marked;
			[todoList, cmwtd, lastDone] = conductFocus(todoList, cmwtd, lastDone, {workLeft:'n'});
			expect(todoList[0].state).equals(TodoState.Completed);
			expect(todoList.length).equals(1);
			expect(cmwtd).equals("");
			expect(lastDone).equals("apple");
		})

		it('updates CMWTD from last marked item to the previous marked', () => {
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList = markAllAs(todoList, TodoState.Marked);
			let cmwtd = "banana";
			let lastDone = "";
			[todoList, cmwtd, lastDone] = conductFocus(todoList, cmwtd, lastDone, {workLeft:'n'});
			expect(todoList[1].state).equals(TodoState.Completed);
			expect(todoList.length).equals(2);
			expect(cmwtd).equals("apple");
			expect(lastDone).equals("banana");
		})
	})
});