import { expect } from 'chai';

import { conductReviews, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, indexOfItem, itemExists, listToMarks, makePrintableTodoItemList } from "../src/todoList";

describe('Adding a new item to the list', () => {
  it('should increase the todo item count by 1', () => {
		let todoList: ITodoItem[] = [];
		const before:number = todoList.length;
		const newItem: ITodoItem = constructNewTodoItem(
			"vaccuum my room"); // , "using the mini-vac"
		todoList = addTodoToList(todoList,newItem);
		const after:number = todoList.length;
		
    expect(after).equals(before + 1);
	});
});

describe('Finding items in a list', () => {
	it('should return the first unmarked item', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		const firstItemIndex = indexOfItem(todoList, "state", TodoState.Unmarked);
		expect(firstItemIndex).equals(1);
	})

	it('should find no unmarked items when all items are completed', () => {
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
		const containsUnmarked = itemExists(todoList, "state", TodoState.Unmarked)
		expect(containsUnmarked).equals(false);
	})
})

describe('Converting a todo item list to a string', () => {
	it('returns msg \'no list items to print\' when list is empty', () => {
		const todoList: ITodoItem[] = [];
		
    expect(makePrintableTodoItemList(todoList)).equals("There are no todo items to print.");
	})

	it('returns correct single string output when only one list item exists', () => {
		
		let todoList: ITodoItem[] = [];
		const newItem: ITodoItem = constructNewTodoItem("make this app");
		todoList = addTodoToList(todoList,newItem);
		
    expect(makePrintableTodoItemList(todoList)).equals("[ ] make this app");
	})

	it('correctly generates 3 lines when there are 3 todo items', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		
    expect(makePrintableTodoItemList(todoList).split("\n").length).equals(3);
	})
})

describe('List to marks function', () => {
	it('should return a list of items marked `[o] [ ]` for a given list', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList[0].state = TodoState.Marked;
		expect(listToMarks(todoList)).equals("[o] [ ]");
	})
})

describe('Conducting list iteration', () => {
	it('should correctly update CMWTD for input `n, y` ', () => {
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
		expect(cmwtd).equals("cherry");
	});
})