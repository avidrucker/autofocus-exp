import { expect } from 'chai';

import { conductReviews, getFirstReadyTodo, readyToReview, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, listToMarks } from '../src/todoList';

describe('Finding ready todos', () => {
	it('returns the first non-complete, non-archived item', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList[0].state = TodoState.Completed;
		expect(getFirstReadyTodo(todoList)).equals(1);
	})

	it('returns -1 when there are no todos', () => {
		const todoList: ITodoItem[] = [];
		expect(getFirstReadyTodo(todoList)).equals(-1);
	});

	it('returns -1 when there are no ready todos', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList[0].state = TodoState.Completed;
		todoList[1].state = TodoState.Completed;
		expect(getFirstReadyTodo(todoList)).equals(-1);
	});

	it('when there are both marked and unmarked items, returns the first of either', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList[0].state = TodoState.Marked;
		todoList[1].state = TodoState.Unmarked;
		expect(getFirstReadyTodo(todoList)).equals(0);
	})
})

describe('Initializing list iteration', () => {
  it('should result in the first item being dotted if it wasn\'t already', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		[todoList, cmwtd] = setupReview(todoList, cmwtd);
    expect(todoList[0].state).equals(TodoState.Marked);
	});

	it('should marked the first non-complete, non-archived item', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		[todoList, cmwtd] = setupReview(todoList, cmwtd);
    expect(todoList[1].state).equals(TodoState.Marked);
	});
});

describe('Conducting reviews', () => {
  it('should return a list of items marked `[o] [ ] [o]` for input `n, y` ', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		[todoList, cmwtd] = setupReview(todoList, cmwtd);
		[todoList, cmwtd] = conductReviews(todoList, cmwtd, ['n', 'y']);
		expect(listToMarks(todoList)).equals("[o] [ ] [o]");
	});
});

describe('Entering review mode,', ()=> {
	it('when there are no todo items, does not affect the todo list or cmwtd', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no todo items."
		[todoList, cmwtd] = conductReviews(todoList, cmwtd, []); // "There are no todo items."
		expect(todoList.length).equals(0);
		expect(cmwtd).equals("");
	});

	it('when there are no unmarked or ready items, doesn\'t affect the todo list or cmwtd', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		todoList[1].state = TodoState.Completed;
		todoList[2].state = TodoState.Completed;
		[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
		[todoList, cmwtd] = conductReviews(todoList, cmwtd, []); // "There are no ready items."
		expect(todoList.length).equals(3);
		expect(cmwtd).equals("");
	});
});

describe('Review mode list iteration', () => {
	it('enables determining when reviewing is not possible because no reviewable items exist', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		todoList[1].state = TodoState.Completed;
		todoList[2].state = TodoState.Completed;
		expect(readyToReview(todoList)).equals(false);
	})

	it('correctly finds the first ready todo item', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		todoList[1].state = TodoState.Completed;
		expect(readyToReview(todoList)).equals(true);
	})
})