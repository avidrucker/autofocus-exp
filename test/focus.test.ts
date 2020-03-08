import { expect } from 'chai';

import { conductFocus } from '../src/focus';
import { constructNewTodoItem, ITodoItem } from '../src/todoItem';
import { addTodoToList } from '../src/todoList';

// issue: Dev resolves bug where completed todo items leave stale CMWTD #218

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