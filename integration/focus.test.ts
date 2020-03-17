import { expect } from 'chai';
import { step } from 'mocha-steps';

import { conductFocus } from '../src/focus';
import { conductReviewsEpic, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, getLastMarked, listToMarks } from '../src/todoList';
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

	// formerly "First mini E2E test"
	describe('integration test of list completion', () => {
		describe('should lead to CMWTD of empty string', () => {
			let todoList: ITodoItem[] = [];
			const aList = ["a"];
			let cmwtd = "";
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
				[todoList, cmwtd] = setupReview(todoList, cmwtd);
				expect(todoList[0].state).equals(TodoState.Marked);
			})

			step('should re-confirm 1 item have been marked', () => {
				const answers001 = [''];
				[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, answers001);
				expect(listToMarks(todoList)).equals("[o]");
			});

			step('should confirm that CMWTD has been updated to last marked item',() => {
				expect(cmwtd).equals(todoList[0].header);
			});

			step('should confirm only item has been completed',() => {
				[todoList, cmwtd, lastDone] = conductFocus(todoList, cmwtd, lastDone, {workLeft: "n"});
				expect(todoList[0].state).equals(TodoState.Completed);
			});

			step('should confirm that CMWTD has been updated',() => {
				expect(cmwtd).equals("");
			});
		});
	});
});