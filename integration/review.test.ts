import { expect } from 'chai';
import { step } from 'mocha-steps';

import { conductFocus } from '../src/focus';
import { setupReview, conductAllReviews } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, listToMarks, getCMWTD } from '../src/todoList';
import { expectOneMarkedApple, FRUITS, makeNItemArray, markAllAs } from '../unit/test-util';

describe('REVIEW MODE INTEGRATION TESTS', ()=> {
	describe('Reviewing 0 item list',() => {
		// when there are no todo items, does not affect the todo list
		it('returns back empty list', () => {
			let todoList: ITodoItem[] = [];
			const lastDone = "";
			todoList = setupReview(todoList); // "There are no todo items."
			todoList = conductAllReviews(todoList, lastDone, []); // "There are no todo items."
			expect(todoList.length).equals(0);
			expect(getCMWTD(todoList)).equals("");
		})
	})
	
	describe('Setting up review for 1 item list',()=> {
		// with no dottable items returns back the items as is
		it('returns list with marked item as-is',() => {
			// make a list with one marked item
			let todoList: ITodoItem[] = makeNItemArray(1);
			todoList[0].state = TodoState.Marked;
			todoList = setupReview(todoList);
			expectOneMarkedApple(todoList);
		})
	
		// with only one dottable item returns a dotted item
		it('returns list with unmarked item marked',()=>{
			// make a list with one unmarked item
			let todoList: ITodoItem[] = makeNItemArray(1);
			todoList = setupReview(todoList);
			expectOneMarkedApple(todoList);
		})
	})
	
	describe('Reviewing 2 item list',()=> {
		it(`with 'y' answer results in two marked items & 2nd item cmwtd`,() => {
			// make a list with one marked, one complete
			let todoList: ITodoItem[] = makeNItemArray(2);
			
			const lastDone = "";
			todoList = setupReview(todoList); // "There are no ready items."
			todoList = conductAllReviews(todoList, lastDone, ['y']); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(getCMWTD(todoList)).equals(FRUITS[1]);
		})

		// with no dottable items returns back the items as is
		// doesn't affect the list if all items are dotted to begin with
		it('returns list with 0 unmarked items as-is',() => {
			// make a list with one marked, one complete
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList = markAllAs(todoList, TodoState.Marked);
			const lastDone = "";
			todoList = setupReview(todoList); // "There are no ready items."
			todoList = conductAllReviews(todoList, lastDone, []); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(getCMWTD(todoList)).equals(FRUITS[1]);
		})
	
		// issue: Architect assess whether firstReady func is appropriate for test #288
		it('returns list as-is when first non-complete, non-archived item is marked',()=>{
			// returns back first non-complete, non-archived "ready" item as marked
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList = setupReview(todoList); // intentional double invocation
			todoList = setupReview(todoList); // intentional double invocation
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(todoList[1].state).equals(TodoState.Unmarked);
			expect(getCMWTD(todoList)).equals(FRUITS[0]);
		})
	
		// should result in the first item being dotted if it wasn't already
		it('modifies list where 1st item is not marked', () => {
				let todoList: ITodoItem[] = makeNItemArray(2);
				
				const lastDone = "";
				todoList = setupReview(todoList);
				expect(todoList[0].state).equals(TodoState.Marked);
		})
	
		// issue: Dev rewrites tests to use intended functions instead of raw mutations #287
		// should marked the first non-complete, non-archived item
		it('modifies lists where the first non-complete, non-archived item is not marked',()=>{
			// returns back first non-complete, non-archived "ready" item as UNmarked
			let todoList: ITodoItem[] = makeNItemArray(2);
			
			todoList[1].state = TodoState.Completed;
			// const lastDone = todoList[1].header;
			todoList = setupReview(todoList);
			expect(todoList[0].state).equals(TodoState.Marked);
			expect(todoList[1].state).equals(TodoState.Completed);
		})
	})

	describe('Conducting reviews', ()=> {
		// with no dottable items returns back the items as is
		it('when 0 ready items, doesn\'t affect the todo list', () => {
			let todoList: ITodoItem[] = makeNItemArray(2);
			
			const lastDone = "";
			todoList[0].state = TodoState.Completed;
			todoList[1].state = TodoState.Completed;
			todoList = setupReview(todoList); // "There are no ready items."
			todoList = conductAllReviews(todoList, lastDone, []); // "There are no ready items."
			expect(todoList.length).equals(2);
			expect(getCMWTD(todoList)).equals("");
		});
	
		it('should return a list of items marked `[o] [ ] [o]` for input [`n`, `y`] ', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			
			const lastDone = "";
			todoList = setupReview(todoList);
			todoList = conductAllReviews(todoList, lastDone, ['n', 'y']);
			expect(getCMWTD(todoList)).equals(FRUITS[2]);
			expect(listToMarks(todoList)).equals("[o] [ ] [o]");
		});

		it('should return a list of items marked `[o] [ ] [ ]` for input [`n`, `n`]', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			const lastDone = "";
			todoList = setupReview(todoList);
			todoList = conductAllReviews(todoList, lastDone, ['n', 'n']);
			expect(getCMWTD(todoList)).equals(FRUITS[0]);
			expect(listToMarks(todoList)).equals("[o] [ ] [ ]");
		});

		it('reviews from last marked (CMWTD) if lastDone is not set', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			const lastDone = "";
			todoList = setupReview(todoList);
			todoList = conductAllReviews(todoList, lastDone, ['n','y']);
			expect(listToMarks(todoList)).equals("[o] [ ] [o]");
		})

		it('reviews from first unmarked if CMWTD is not set', () => {
			let todoList: ITodoItem[] = makeNItemArray(3);
			let lastDone: string = "";
			todoList = setupReview(todoList);
			[todoList, lastDone ] = conductFocus(todoList, lastDone, {workLeft: 'n'});
			todoList = setupReview(todoList);
			todoList = conductAllReviews(todoList, lastDone, ['y']);
			expect(listToMarks(todoList)).equals("[x] [o] [o]");
		})
	});

	// issue: Dev refactors "review from lastDone if set" case into suite #290
	describe('reviews from lastDone if set', () => {
		let todoList: ITodoItem[] = makeNItemArray(5);
		let lastDone: string = "";
		step('should allow correct first review and focus', () => {
			todoList = setupReview(todoList);
			todoList = conductAllReviews(todoList, lastDone, ['n','y','n','n']);
			[todoList, lastDone ] = conductFocus(todoList, lastDone, {workLeft: 'n'});
			expect(listToMarks(todoList)).equals("[o] [ ] [x] [ ] [ ]");
			expect(getCMWTD(todoList)).equals(todoList[0].header);
		})
		
		step('should allow correct 2nd review', () => {
			todoList = conductAllReviews(todoList, lastDone, ['n', 'y']);
			expect(listToMarks(todoList)).equals("[o] [ ] [x] [ ] [o]");
		})
	})

	// formerly "Second mini E2E test"
	describe('integration test of review completion', () => {
		describe('should lead to no reviewable items', () => {
			let todoList: ITodoItem[] = [];
			const aList = ["a","b"];
			
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
				todoList = setupReview(todoList);
				expect(todoList[0].state).equals(TodoState.Marked);
			})

			step('should re-confirm 1 item have been marked', () => {
				const answers001 = ['y'];
				todoList = conductAllReviews(todoList, lastDone, answers001);
				expect(listToMarks(todoList)).equals("[o] [o]");
			});

			step('should confirm that CMWTD has been updated to last marked item',() => {
				expect(getCMWTD(todoList)).equals(todoList[1].header);
			});

			step('should confirm that reviewing does nothing now', () => {
				todoList = setupReview(todoList);
				expect(todoList[0].state).equals(TodoState.Marked);
				expect(todoList[1].state).equals(TodoState.Marked);
			})

			step('should confirm only item has been completed',() => {
				[todoList, lastDone] = conductFocus(todoList, lastDone, {workLeft: "n"});
				expect(todoList[1].state).equals(TodoState.Completed);
			});

			step('should confirm that CMWTD has been updated',() => {
				expect(getCMWTD(todoList)).equals(todoList[0].header);
			});
		});
	});

	describe('Reviewing lists with completed items',()=>{
		it('works only on reviewable subset of list',()=>{
			let todoList: ITodoItem[] = makeNItemArray(5);
			const lastDone = "";
			todoList[0].state = TodoState.Completed;
			todoList[2].state = TodoState.Completed;
			todoList[4].state = TodoState.Completed;
			todoList = setupReview(todoList);
			todoList = conductAllReviews(todoList, lastDone, ['y']);
			expect(listToMarks(todoList)).equals("[x] [o] [x] [o] [x]");
		});
	});
});