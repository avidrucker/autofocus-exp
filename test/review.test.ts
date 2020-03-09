import { expect } from 'chai';

import { conductReviews, readyToReview, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, getFirstUnmarked, listToMarks } from '../src/todoList';

describe('REVIEW MODE TESTS', ()=> {
	describe('Reviewing 0 item list',() => {
		// when there are no todo items, does not affect the todo list or cmwtd
		it('returns back empty list', () => {
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no todo items."
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, []); // "There are no todo items."
			expect(todoList.length).equals(0);
			expect(cmwtd).equals("");
		})
	})
	
	describe('Reviewing 1 item list',()=> {
		it('returns list with marked item as-is',() => {
			// make a list with one marked item
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			todoList = addTodoToList(todoList,item1);
			todoList[0].state = TodoState.Marked;
			let cmwtd = "apple";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList.length).equals(1);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(cmwtd).equals("apple");
		})
	
		it('returns list with unmarked item marked',()=>{
			// make a list with one unmarked item
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			const item1: ITodoItem = constructNewTodoItem("apple");
			todoList = addTodoToList(todoList,item1);
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList.length).equals(1);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(cmwtd).equals("apple");
		})
	})
	
	describe('Reviewing 2 item list',()=> {
		it('with \'y\' answer results in two marked items & 2nd item cmwtd',() => {
			// make a list with one marked, one complete
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, ['y']); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(cmwtd).equals("banana");
		})


		// doesn't affect the list if all items are dotted to begin with
		it('returns list with 0 unmarked items as-is',() => {
			// make a list with one marked, one complete
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[0].state = TodoState.Marked;
			todoList[1].state = TodoState.Marked;
			let cmwtd = "banana";
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, []); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(cmwtd).equals("banana");
		})
	
		// todo: use firstReady function
		// logic: if firstReady is marked, do nothing.
		// logic continued: if firstReady is not marked, mark it
		it('returns list as-is when first non-complete, non-archived item is marked',()=>{
			// returns back first non-complete, non-archived "ready" item as marked
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[0].state = TodoState.Marked;
			let cmwtd = "apple";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(todoList[1].state).equals(TodoState.Unmarked);
			expect(cmwtd).equals("apple");
		})
	
		// should result in the first item being dotted if it wasn't already
		it('modifies list where 1st item is not marked', () => {
				let todoList: ITodoItem[] = [];
				let cmwtd = "";
				const item1: ITodoItem = constructNewTodoItem("apple");
				const item2: ITodoItem = constructNewTodoItem("banana");
				todoList = addTodoToList(todoList,item1);
				todoList = addTodoToList(todoList,item2);
				[todoList, cmwtd] = setupReview(todoList, cmwtd);
				expect(todoList[0].state).equals(TodoState.Marked);
		})
	
		// todo: use firstReady function
		// should marked the first non-complete, non-archived item
		it('modifies lists where the first non-complete, non-archived item is not marked',()=>{
			// returns back first non-complete, non-archived "ready" item as UNmarked
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[1].state = TodoState.Completed;
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(todoList[1].state).equals(TodoState.Completed);
		})
	})
	
	describe('Finding unmarked todos', () => {
		it('when there is one item, returns the first unmarked item', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			todoList = addTodoToList(todoList,item1);
			expect(todoList.length).equals(1);
			expect(getFirstUnmarked(todoList)).equals(0);
		})

		it('when there are multiple items, returns the first unmarked item', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[0].state = TodoState.Completed;
			expect(getFirstUnmarked(todoList)).equals(1);
		})
	
		it('returns -1 when there are no todos', () => {
			const todoList: ITodoItem[] = [];
			expect(getFirstUnmarked(todoList)).equals(-1);
		});
	
		it('returns -1 when there are no unmarked todos', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[0].state = TodoState.Completed;
			todoList[1].state = TodoState.Completed;
			expect(getFirstUnmarked(todoList)).equals(-1);
		});
	
		it('when there are both marked and unmarked items, returns the unmarked item', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[0].state = TodoState.Marked;
			todoList[1].state = TodoState.Unmarked;
			expect(getFirstUnmarked(todoList)).equals(1);
		})
	});
	
	describe('Conducting reviews', ()=> {
		it('when 0 ready items, doesn\'t affect the todo list or cmwtd', () => {
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList[0].state = TodoState.Completed;
			todoList[1].state = TodoState.Completed;
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, []); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(cmwtd).equals("");
		});
	
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
			expect(cmwtd).equals("cherry");
			expect(listToMarks(todoList)).equals("[o] [ ] [o]");
		});

		it('should return a list of items marked `[o] [ ] [ ]` for input `n, n` ', () => {
			let todoList: ITodoItem[] = [];
			let cmwtd: string = "";
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			const item3: ITodoItem = constructNewTodoItem("cherry");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList = addTodoToList(todoList,item3);
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, ['n', 'n']);
			expect(cmwtd).equals("apple");
			expect(listToMarks(todoList)).equals("[o] [ ] [ ]");
		});
	});
	
	describe('Ready to review check', () => {
		it('determines list `[o][o][o]` NOT ready for review', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			const item3: ITodoItem = constructNewTodoItem("cherry");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList = addTodoToList(todoList,item3);
			todoList[0].state = TodoState.Marked;
			todoList[1].state = TodoState.Marked;
			todoList[2].state = TodoState.Marked;
			expect(readyToReview(todoList)).equals(false);
		})

		it('determines list `[x][x][o]` NOT ready for review', () => {
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

		it('determines list `[x][o][ ]` ready for review', () => {
			let todoList: ITodoItem[] = [];
			let cmwtd: string = "";
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			const item3: ITodoItem = constructNewTodoItem("cherry");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList = addTodoToList(todoList,item3);
			todoList[0].state = TodoState.Completed;
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(cmwtd).equals("banana");
			expect(readyToReview(todoList)).equals(true);
		})
	
		it('determines list `[x][ ][ ]` ready for review', () => {
			let todoList: ITodoItem[] = [];
			const item1: ITodoItem = constructNewTodoItem("apple");
			const item2: ITodoItem = constructNewTodoItem("banana");
			const item3: ITodoItem = constructNewTodoItem("cherry");
			todoList = addTodoToList(todoList,item1);
			todoList = addTodoToList(todoList,item2);
			todoList = addTodoToList(todoList,item3);
			todoList[0].state = TodoState.Completed;
			expect(readyToReview(todoList)).equals(true);
		})
	})
});

// describe('',()=> {
// 	it('',()=>{
// 		print();
// 	})
// })