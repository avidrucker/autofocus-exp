import { expect } from 'chai';
import { step } from 'mocha-steps';

import { conductFocus } from '../src/focus';
import { conductReviewsEpic, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, getLastMarked, listToMarks, getCMWTD } from '../src/todoList';
import { FRUITS, makeNItemArray, markAllAs } from '../unit/test-util';

describe('FOCUS MODE INTEGRATION TESTS', ()=> {
	describe('Entering focus mode', ()=> {
		it('when there 0 items does not affect the todo list, or lastDone', () => {
			let todoList: ITodoItem[] = [];
			let lastDone = "";
			[todoList, lastDone] = conductFocus(todoList, lastDone, {workLeft: 'y'}); // "There are no todo items."
			expect(todoList.length).equals(0);
			expect(getCMWTD(todoList)).equals("");
			expect(lastDone).equals("");
		});

		it('when no marked items exist, leaves todo list & cmwtd as-is', () => {
			let todoList: ITodoItem[] = makeNItemArray(1);
			
			let lastDone = "";
			[todoList, lastDone] = conductFocus(todoList, lastDone, {workLeft: 'y'}); // "The CMWTD has not been set."
			expect(todoList.length).equals(1);
			expect(getCMWTD(todoList)).equals("");
		})
	});

	// issue: Dev writes test to confirm duplication behavior from positive workLeft #272
	
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
			expect(getLastMarked(todoList)).equals(0);
		})
	});

	describe('Updating the CMWTD', () => {
		it('updates CMWTD from something to nothing', () => {
			let todoList: ITodoItem[] = makeNItemArray(1);
			
			let lastDone = "";
			todoList = setupReview(todoList);
			[todoList, lastDone] = conductFocus(todoList, lastDone, {workLeft:'n'});
			expect(todoList[0].state).equals(TodoState.Completed);
			expect(todoList.length).equals(1);
			expect(getCMWTD(todoList)).equals("");
			expect(lastDone).equals(FRUITS[0]);
		})

		// issue: Dev rewrites tests to use intended functions instead of raw mutations #287
		it('updates CMWTD from last marked item to the previous marked', () => {
			let todoList: ITodoItem[] = makeNItemArray(2);
			todoList = markAllAs(todoList, TodoState.Marked);
			let lastDone = "";
			[todoList, lastDone] = conductFocus(todoList, lastDone, {workLeft:'n'});
			expect(todoList[1].state).equals(TodoState.Completed);
			expect(todoList.length).equals(2);
			expect(getCMWTD(todoList)).equals(FRUITS[0]);
			expect(lastDone).equals(FRUITS[1]);
		})
	})

	// formerly "First mini E2E test"
	describe('integration test of list completion', () => {
		describe('should lead to CMWTD of empty string', () => {
			let todoList: ITodoItem[] = [];
			const aList = ["a"];
			
			let lastDone = "";

			step('should confirm 1 item has been added', () => {
				aList.forEach(
					x => {
						todoList = addTodoToList(
						todoList, constructNewTodoItem(x))
					});

				expect(todoList.length).equals(1);
			});

			step('should confirm that the 1st item has been marked', () => {
				todoList = setupReview(todoList);
				expect(todoList[0].state).equals(TodoState.Marked);
			})

			step('should re-confirm 1 item have been marked', () => {
				const answers001 = [''];
				todoList = conductReviewsEpic(todoList, lastDone, answers001);
				expect(listToMarks(todoList)).equals("[o]");
			});

			step('should confirm that CMWTD has been updated to last marked item',() => {
				expect(getCMWTD(todoList)).equals(todoList[0].header);
			});

			step('should confirm only item has been completed',() => {
				[todoList, lastDone] = conductFocus(todoList, lastDone, {workLeft: "n"});
				expect(todoList[0].state).equals(TodoState.Completed);
			});

			step('should confirm that CMWTD has been updated',() => {
				expect(getCMWTD(todoList)).equals("");
			});
		});
	});
});