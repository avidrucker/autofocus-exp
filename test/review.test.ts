import { expect } from 'chai';

import { conductReviews, readyToReview, setupReview } from '../src/review';
import { ITodoItem, TodoState } from '../src/todoItem';
import { getFirstUnmarked, listToMarks } from '../src/todoList';
import { expectOneMarkedApple, FRUITS, makeNItemArray, markAllAs } from './test-util';

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
	
	describe('Setting up review for 1 item list',()=> {
		it('returns list with marked item as-is',() => {
			// make a list with one marked item
			let todoList: ITodoItem[] = makeNItemArray(1);
			todoList[0].state = TodoState.Marked;
			let cmwtd = FRUITS[0];
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expectOneMarkedApple(todoList, cmwtd);
		})
	
		it('returns list with unmarked item marked',()=>{
			// make a list with one unmarked item
			let todoList: ITodoItem[] = makeNItemArray(1);
			let cmwtd = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expectOneMarkedApple(todoList, cmwtd);
		})
	})
	
	// issue: Dev renames, relocates as integration tests #247
	describe('Reviewing 2 item list',()=> {
		it('with \'y\' answer results in two marked items & 2nd item cmwtd',() => {
			// make a list with one marked, one complete
			let todoList: ITodoItem[] = makeNItemArray(2);
			let cmwtd = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, ['y']); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(cmwtd).equals("banana");
		})


		// doesn't affect the list if all items are dotted to begin with
		it('returns list with 0 unmarked items as-is',() => {
			// make a list with one marked, one complete
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList = markAllAs(todoList, TodoState.Marked);
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
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList[0].state = TodoState.Marked;
			let cmwtd = FRUITS[0];
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(todoList[1].state).equals(TodoState.Unmarked);
			expect(cmwtd).equals(FRUITS[0]);
		})
	
		// should result in the first item being dotted if it wasn't already
		it('modifies list where 1st item is not marked', () => {
				let todoList: ITodoItem[] = makeNItemArray(2);
				let cmwtd = "";
				[todoList, cmwtd] = setupReview(todoList, cmwtd);
				expect(todoList[0].state).equals(TodoState.Marked);
		})
	
		// todo: use firstReady function
		// should marked the first non-complete, non-archived item
		it('modifies lists where the first non-complete, non-archived item is not marked',()=>{
			// returns back first non-complete, non-archived "ready" item as UNmarked
			let todoList: ITodoItem[] = makeNItemArray(2);
			let cmwtd = "";
			todoList[1].state = TodoState.Completed;
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(todoList[1].state).equals(TodoState.Completed);
		})
	})
	
	describe('Finding unmarked todos', () => {
		it('when there is one item, returns the first unmarked item', () => {
			const todoList: ITodoItem[] = makeNItemArray(1);
			expect(todoList.length).equals(1);
			expect(getFirstUnmarked(todoList)).equals(0);
		})

		it('when there are multiple items, returns the first unmarked item', () => {
			const todoList: ITodoItem[] = makeNItemArray(2);
			todoList[0].state = TodoState.Completed;
			expect(getFirstUnmarked(todoList)).equals(1);
		})
	
		it('returns -1 when there are no todos', () => {
			const todoList: ITodoItem[] = makeNItemArray(0);
			expect(getFirstUnmarked(todoList)).equals(-1);
		});
	
		it('returns -1 when there are no unmarked todos', () => {
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList = markAllAs(todoList, TodoState.Completed);
			expect(getFirstUnmarked(todoList)).equals(-1);
		});
	
		it('when there are both marked and unmarked items, returns the unmarked item', () => {
			const todoList: ITodoItem[] = makeNItemArray(2);
			todoList[0].state = TodoState.Marked;
			todoList[1].state = TodoState.Unmarked;
			expect(getFirstUnmarked(todoList)).equals(1);
		})
	});
	
	// issue: Dev renames, relocates as integration tests #247
	describe('Conducting reviews', ()=> {
		it('when 0 ready items, doesn\'t affect the todo list or cmwtd', () => {
			let todoList: ITodoItem[] = makeNItemArray(2);
			let cmwtd = "";
			todoList[0].state = TodoState.Completed;
			todoList[1].state = TodoState.Completed;
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, []); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(cmwtd).equals("");
		});
	
		it('should return a list of items marked `[o] [ ] [o]` for input `n, y` ', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let cmwtd = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, ['n', 'y']);
			expect(cmwtd).equals("cherry");
			expect(listToMarks(todoList)).equals("[o] [ ] [o]");
		});

		it('should return a list of items marked `[o] [ ] [ ]` for input `n, n` ', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let cmwtd: string = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, ['n', 'n']);
			expect(cmwtd).equals(FRUITS[0]);
			expect(listToMarks(todoList)).equals("[o] [ ] [ ]");
		});
	});
	
	// issue: Dev refactors WET code to be more DRY #248
	describe('Ready to review check', () => {
		it('determines list `[o][o][o]` NOT ready for review', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			todoList = markAllAs(todoList, TodoState.Marked);
			expect(readyToReview(todoList)).equals(false);
		})

		it('determines list `[x][x][o]` NOT ready for review', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			todoList = markAllAs(todoList, TodoState.Completed);
			expect(readyToReview(todoList)).equals(false);
		})

		it('determines list `[x][o][ ]` ready for review', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let cmwtd: string = "";
			todoList[0].state = TodoState.Completed;
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(cmwtd).equals("banana");
			expect(readyToReview(todoList)).equals(true);
		})
	
		it('determines list `[x][ ][ ]` ready for review', () => {
			const todoList: ITodoItem[] = makeNItemArray(3);
			todoList[0].state = TodoState.Completed;
			expect(readyToReview(todoList)).equals(true);
		})
	})
});

// issue: Dev removes commented out code snippets #249
// describe('',()=> {
// 	it('',()=>{
// 		print();
// 	})
// })