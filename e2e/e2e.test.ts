import { expect } from 'chai';
import { step } from 'mocha-steps';

import { conductFocus } from '../src/focus';
import { conductReviewsEpic, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, listToMarks } from '../src/todoList';

describe('Simple E2E test', () => {
  describe('should pass each successive step', () => {
		let todoList: ITodoItem[] = [];
		const firstThree = ["Write report","Check email","Tidy desk"];
		let cmwtd = "";
		let lastDone = "";

		step('should confirm 3 specific items have been added', () => {
			firstThree.forEach(
				x => {
					todoList = addTodoToList(
					todoList,constructNewTodoItem(x))
				});

			expect(todoList.length).equals(3);
		});

		step('should confirm that the 1st item has been marked', () => {
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(listToMarks(todoList)).equals("[o] [ ] [ ]");
		})

		step('should confirm 3 items have been marked', () => {
			const answers001 = ['y','y'];
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, answers001);
			expect(listToMarks(todoList)).equals("[o] [o] [o]");
		});

		step('should confirm that CMWTD has been updated to last item',() => {
			expect(cmwtd).equals(todoList[2].header);
		});

		step('should confirm 3rd item has been completed',() => { 
			// and that CMWTD & lastDone have been updated
			const beforeCMWTD = String(cmwtd);
			[todoList, cmwtd, lastDone] = conductFocus(todoList, cmwtd, lastDone, {workLeft: "n"});
			expect(todoList[2].state).equals(TodoState.Completed);
			expect(cmwtd).equals(todoList[1].header);
			expect(lastDone).equals(beforeCMWTD);
		});
	});
});

describe('Long E2E test', () => {
  describe('should pass each successive step', () => {
		let todoList: ITodoItem[] = [];
		const longList = ["Email", "In-Tray", "Voicemail", "Project X Report",
			"Tidy Desk", "Call Dissatisfied Customer", "Make Dental Appointment",
			"File Invoices", "Discuss Project Y with Bob", "Back Up"];
		let cmwtd = "";
		let lastDone = "";

		// create 10 items, and add them to the list
		step('should confirm 10 items have been added', () => {
			longList.forEach(
				x => {
					todoList = addTodoToList(
					todoList,constructNewTodoItem(x))
				});

			expect(todoList.length).equals(10);
		});
		// put a a dot in front of the first task
		step('should confirm that the 1st item has been marked', () => {
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList[0].state).equals(TodoState.Marked);
		})
		// review items, saying yes only for 3rd & 5th items
		step('should confirm 3 items have been marked', () => {
			const answers001 = ['n','y','n','y','q'];
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, answers001);
			expect(listToMarks(todoList)).equals(
				"[o] [ ] [o] [ ] [o] [ ] [ ] [ ] [ ] [ ]");
		});

		step('should confirm that CMWTD has been updated to last marked item',() => {
			expect(cmwtd).equals(todoList[4].header);
		});
		// Do the "Tidy Desk" task (last marked item / CMWTD)
		step('should confirm 3rd item has been completed',() => {
			[todoList, cmwtd, lastDone] = conductFocus(todoList, cmwtd, lastDone, {workLeft: "n"});
			expect(todoList[4].state).equals(TodoState.Completed);
		});

		step('should confirm that CMWTD has been updated',() => {
			expect(cmwtd).equals(todoList[2].header);
		});

		// issue: Dev implements review always starts from last dotted item (CMWTD) #258
		// 1. setting up reviews here should do nothing
		step('should confirm starting new review leaves list & CMWTD alone', () => {
			const beforeList: string = listToMarks(todoList);
			const beforeCMWTD: string = String(cmwtd);
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			const afterList: string = listToMarks(todoList);
			const afterCMWTD: string = String(cmwtd);
			expect(beforeList).equals(afterList);
			expect(beforeCMWTD).equals(afterCMWTD);
		})

		// review items, saying yes only to last item (in this review it will be the 5th)
		step('should confirm 3 specific items have been marked', () => {
			const answers002 = ['n','n','n','n','y'];
			[todoList, cmwtd] = conductReviewsEpic(todoList, cmwtd, lastDone, answers002);
			expect(listToMarks(todoList)).equals(
				"[o] [ ] [o] [ ] [x] [ ] [ ] [ ] [ ] [o]");
		});
	}); 
});

// issue: Dev renames, relocates as integration tests #247 
describe('First mini E2E test', () => {
  describe('should pass each successive step', () => {
		let todoList: ITodoItem[] = [];
		const aList = ["a"];
		let cmwtd = "";
		let lastDone = "";

		step('should confirm 1 item has been added', () => {
			aList.forEach(
				x => {
					todoList = addTodoToList(
					todoList,constructNewTodoItem(x))
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

// issue: Dev renames, relocates as integration tests #247
describe('Second mini E2E test', () => {
  describe('should pass each successive step', () => {
		let todoList: ITodoItem[] = [];
		const aList = ["a","b"];
		let cmwtd = "";
		let lastDone = "";

		step('should confirm 2 items has been added', () => {
			aList.forEach(
				x => {
					todoList = addTodoToList(
					todoList,constructNewTodoItem(x))
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