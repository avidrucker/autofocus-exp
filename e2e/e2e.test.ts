import { expect } from 'chai';
import { step } from 'mocha-steps';

import { conductFocus } from '../src/focus';
import { conductReviews, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, listToMarks } from '../src/todoList';

describe('Simple E2E test', () => {
  describe('should pass each successive step', () => {
		let todoList: ITodoItem[] = [];
		const firstThree = ["Write report","Check email","Tidy desk"];
		let cmwtd = "";

		step('should confirm 3 items have been added', () => {
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
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, answers001);
			expect(listToMarks(todoList)).equals("[o] [o] [o]");
		});

		step('should confirm that CMWTD has been updated to last item',() => {
			expect(cmwtd).equals(todoList[2].header);
		});

		step('should confirm 3rd item has been completed',() => {
			[todoList, cmwtd] = conductFocus(todoList, cmwtd, {workLeft: "n"});
			expect(todoList[2].state).equals(TodoState.Completed);
		});

		step('should confirm that CMWTD has been updated',() => {
			expect(cmwtd).equals(todoList[1].header);
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

		step('should confirm 10 items have been added', () => {
			longList.forEach(
				x => {
					todoList = addTodoToList(
					todoList,constructNewTodoItem(x))
				});

			expect(todoList.length).equals(10);
		});

		step('should confirm that the 1st item has been marked', () => {
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			expect(todoList[0].state).equals(TodoState.Marked);
		})

		step('should confirm 3 items have been marked', () => {
			const answers001 = ['n','y','n','y','q'];
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, answers001);
			expect(listToMarks(todoList)).equals(
				"[o] [ ] [o] [ ] [o] [ ] [ ] [ ] [ ] [ ]");
		});

		step('should confirm that CMWTD has been updated to last marked item',() => {
			expect(cmwtd).equals(todoList[4].header);
		});

		step('should confirm 3rd item has been completed',() => {
			[todoList, cmwtd] = conductFocus(todoList, cmwtd, {workLeft: "n"});
			expect(todoList[4].state).equals(TodoState.Completed);
		});

		step('should confirm that CMWTD has been updated',() => {
			expect(cmwtd).equals(todoList[2].header);
		});
	});
});