import { expect } from 'chai';

import { conductReviewsEpic, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, indexOfItem, itemExists, listToMarks, makePrintableTodoItemList, undotAll } from "../src/todoList";
import { makeNItemArray, markAllAs } from './test-util';

describe('TODO LIST TESTS', () => {
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
			const todoList: ITodoItem[] = makeNItemArray(3);
			todoList[0].state = TodoState.Completed;
			const firstItemIndex = indexOfItem(todoList, "state", TodoState.Unmarked);
			expect(firstItemIndex).equals(1);
		})
	
		it('should find no unmarked items when all items are completed', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			todoList = markAllAs(todoList, TodoState.Completed);
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
	
		// issue: Dev refactors WET code to be more DRY #248
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
	
	// issue: Dev renames, relocates as integration tests #247
	describe('List to marks function', () => {
		it('should return a list of items marked `[o] [ ]` for a given list', () => {
			const todoList: ITodoItem[] = makeNItemArray(2);
			todoList[0].state = TodoState.Marked;
			expect(listToMarks(todoList)).equals("[o] [ ]");
		})
	})
	
	// issue: Dev renames, relocates as integration tests #247
	describe('Conducting list iteration', () => {
		it('should correctly update CMWTD for input `n, y` ', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let cmwtd = "";
			const lastDone = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, ['n', 'y']);
			expect(cmwtd).equals("cherry");
		});
	})

	// issue: Dev renames, relocates as integration tests #247
	describe('Undotting all items', () => {
		it('undots list of dotted, undotted, & completed items', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			todoList[0].state = TodoState.Completed;
			todoList[1].state = TodoState.Marked;
			todoList = undotAll(todoList);
			expect(todoList[0].state).equals(TodoState.Completed);
			expect(todoList[1].state).equals(TodoState.Unmarked);
			expect(todoList[2].state).equals(TodoState.Unmarked);
		})
	})
})