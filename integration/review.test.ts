import { expect } from 'chai';
import { step } from 'mocha-steps';

import { conductFocus } from '../src/focus';
import { conductReviewsEpic, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, listToMarks } from '../src/todoList';
import { expectOneMarkedApple, FRUITS, makeNItemArray, markAllAs } from '../unit/test-util';


describe('REVIEW MODE INTEGRATION TESTS', ()=> {
	describe('Reviewing 0 item list',() => {
		// when there are no todo items, does not affect the todo list or cmwtd
		it('returns back empty list', () => {
			let todoList: ITodoItem[] = [];
			let cmwtd = "";
			const lastDone = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no todo items."
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, []); // "There are no todo items."
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
			const lastDone = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
			[todoList, cmwtd ] = conductReviewsEpic(todoList, cmwtd, lastDone, ['y']); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(cmwtd).equals("banana");
		})


		// doesn't affect the list if all items are dotted to begin with
		it('returns list with 0 unmarked items as-is',() => {
			// make a list with one marked, one complete
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList = markAllAs(todoList, TodoState.Marked);
			let cmwtd = "banana";
			const lastDone = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, []); // "There are no ready items."
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
			const lastDone = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(todoList[1].state).equals(TodoState.Unmarked);
			expect(cmwtd).equals(FRUITS[0]);
		})
	
		// should result in the first item being dotted if it wasn't already
		it('modifies list where 1st item is not marked', () => {
				let todoList: ITodoItem[] = makeNItemArray(2);
				let cmwtd = "";
				const lastDone = "";
				[todoList, cmwtd] = setupReview(todoList, cmwtd);
				expect(todoList[0].state).equals(TodoState.Marked);
		})
	
		// todo: use prod intended functions to drive state transitions
		// should marked the first non-complete, non-archived item
		it('modifies lists where the first non-complete, non-archived item is not marked',()=>{
			// returns back first non-complete, non-archived "ready" item as UNmarked
			let todoList: ITodoItem[] = makeNItemArray(2);
			let cmwtd = "";
			todoList[1].state = TodoState.Completed;
			const lastDone = todoList[1].header;
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(todoList[1].state).equals(TodoState.Completed);
		})
	})

	// issue: Dev renames, relocates as integration tests #247
	describe('Conducting reviews', ()=> {
		it('when 0 ready items, doesn\'t affect the todo list or cmwtd', () => {
			let todoList: ITodoItem[] = makeNItemArray(2);
			let cmwtd = "";
			const lastDone = "";
			todoList[0].state = TodoState.Completed;
			todoList[1].state = TodoState.Completed;
			[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, []); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(cmwtd).equals("");
		});
	
		it('should return a list of items marked `[o] [ ] [o]` for input `n, y` ', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let cmwtd = "";
			const lastDone = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, ['n', 'y']);
			expect(cmwtd).equals("cherry");
			expect(listToMarks(todoList)).equals("[o] [ ] [o]");
		});

		it('should return a list of items marked `[o] [ ] [ ]` for input `n, n` ', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let cmwtd: string = "";
			const lastDone = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, ['n', 'n']);
			expect(cmwtd).equals(FRUITS[0]);
			expect(listToMarks(todoList)).equals("[o] [ ] [ ]");
		});

		// todo: label, relocate as integration test
		it('reviews from lastDone if set', () => {
			let todoList: ITodoItem[] = makeNItemArray(5);
			let cmwtd: string = "";
			let lastDone: string = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, ['n','y','n','n']);
			[todoList, cmwtd, lastDone ] = conductFocus(todoList, cmwtd, lastDone, {workLeft: 'n'});
			// expect(listToMarks(todoList)).equals("[o] [ ] [x] [ ] [ ]");
			// expect(cmwtd).equals(todoList[0].header);
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, ['n', 'y']);
			expect(listToMarks(todoList)).equals("[o] [ ] [x] [ ] [o]");
		})

		it('reviews from last marked (CMWTD) if lastDone is not set', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let cmwtd: string = "";
			const lastDone = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, ['n','y']);
			expect(listToMarks(todoList)).equals("[o] [ ] [o]");
		})

		it('reviews from first unmarked if CMWTD is not set', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let cmwtd: string = "";
			let lastDone: string = "";
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			[todoList, cmwtd, lastDone ] = conductFocus(todoList, cmwtd, lastDone, {workLeft: 'n'});
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, ['y','y']);
			expect(listToMarks(todoList)).equals("[x] [o] [o]");
		})
	});

	// formerly "Second mini E2E test"
	describe('integration test of review completion', () => {
		describe('should lead to no reviewable items', () => {
			let todoList: ITodoItem[] = [];
			const aList = ["a","b"];
			let cmwtd = "";
			let lastDone = "";

			step('should confirm 2 items has been added', () => {
				aList.forEach(
					x => {
						todoList = addTodoToList(
						todoList, constructNewTodoItem(x))
					});

				expect(todoList.length).equals(2);
			});

			step('should confirm that the 1st item has been marked', () => {
				[todoList, cmwtd] = setupReview(todoList, cmwtd);
				expect(todoList[0].state).equals(TodoState.Marked);
			})

			step('should re-confirm 1 item have been marked', () => {
				const answers001 = ['y'];
				[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, answers001);
				expect(listToMarks(todoList)).equals("[o] [o]");
			});

			step('should confirm that CMWTD has been updated to last marked item',() => {
				expect(cmwtd).equals(todoList[1].header);
			});

			step('should confirm that reviewing does nothing now', () => {
				[todoList, cmwtd] = setupReview(todoList, cmwtd);
				expect(todoList[0].state).equals(TodoState.Marked);
				expect(todoList[1].state).equals(TodoState.Marked);
			})

			step('should confirm only item has been completed',() => {
				[todoList, cmwtd, lastDone] = conductFocus(todoList, cmwtd, lastDone, {workLeft: "n"});
				expect(todoList[1].state).equals(TodoState.Completed);
			});

			step('should confirm that CMWTD has been updated',() => {
				expect(cmwtd).equals(todoList[0].header);
			});
		});
	});
});