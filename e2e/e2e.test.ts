import { expect } from 'chai';
import { step } from 'mocha-steps';

import { conductFocus } from '../src/focus';
import { conductReviewsEpic, setupReview } from '../src/review';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';
import { addTodoToList, listToMarks, getCMWTD } from '../src/todoList';

describe('Simple E2E test', () => {
  describe('should pass each successive step', () => {
		let todoList: ITodoItem[] = [];
		const firstThree = ["Write report","Check email","Tidy desk"];
		let lastDone = "";

		step('should confirm 3 specific items have been added', () => {
			firstThree.forEach(
				x => {
					todoList = addTodoToList(
					todoList,constructNewTodoItem(x))
				});

			expect(todoList.length).equals(3);
			expect(listToMarks(todoList)).equals("[ ] [ ] [ ]");
		});

		step('should confirm that the 1st item has been marked', () => {
			todoList = setupReview(todoList);
			expect(listToMarks(todoList)).equals("[o] [ ] [ ]");
		})

		step('should confirm 3 items have been marked', () => {
			const answers001 = ['y','y'];
			todoList = conductReviewsEpic(todoList, lastDone, answers001);
			expect(listToMarks(todoList)).equals("[o] [o] [o]");
		});

		step('should confirm that CMWTD has been updated to last item',() => {
			expect(getCMWTD(todoList)).equals(todoList[2].header);
		});

		step('should confirm 3rd item has been completed',() => { 
			// and that CMWTD & lastDone have been updated
			const beforeCMWTD = String(getCMWTD(todoList));
			[todoList, lastDone] = conductFocus(todoList, lastDone, {workLeft: "n"});
			expect(todoList[2].state).equals(TodoState.Completed);
			expect(getCMWTD(todoList)).equals(todoList[1].header);
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

		// "put a dot in front of the first task"
		step('should confirm that the 1st item has been marked', () => {
			todoList = setupReview(todoList);
			expect(todoList[0].state).equals(TodoState.Marked);
		})

		// "Now ask yourself 'What do I want to do more than Email?'
		// You decide you want to do Voicemail more than Email.
		// Put a dot in front of it.
		// Now ask yourself 'What do I want to do more than Voicemail?'
		// You decide you want to tidy your desk."
		// review items, saying yes only for 3rd & 5th items
		step('should confirm 3 items have been marked', () => {
			const answers001 = ['n','y','n','y','q'];
			todoList = conductReviewsEpic(todoList, lastDone, answers001);
			expect(listToMarks(todoList)).equals(
				"[o] [ ] [o] [ ] [o] [ ] [ ] [ ] [ ] [ ]");
		});

		step('should confirm that CMWTD has been updated to last marked item',() => {
			expect(getCMWTD(todoList)).equals(todoList[4].header);
		});

		// Do the "Tidy Desk" task (last marked item / CMWTD)
		step('should confirm 3rd item has been completed',() => {
			[todoList,  lastDone] = conductFocus(todoList, lastDone, {workLeft: "n"});
			expect(todoList[4].state).equals(TodoState.Completed);
		});

		step('should confirm that CMWTD has been updated',() => {
			expect(getCMWTD(todoList)).equals(todoList[2].header);
		});

		// note: this is not specifically part of the e2e flow, but
		// please leave as is
		// 1. setting up reviews here should do nothing
		step('should confirm starting new review leaves list alone', () => {
			const beforeList: string = listToMarks(todoList);
			const beforeCMWTD: string = String(getCMWTD(todoList));
			todoList = setupReview(todoList);
			const afterList: string = listToMarks(todoList);
			const afterCMWTD: string = String(getCMWTD(todoList));
			expect(beforeList).equals(afterList);
			expect(beforeCMWTD).equals(afterCMWTD);
		})

		// again, this next step is not strictly part of the e2e flow
		// but, still, it is useful to test in situations such as this
		step('should confirm review-then-quit leaves list as-is', () => {
			const answer = ['q']; // immediately quitting, w/ no 'y' or 'n' answers
			todoList = conductReviewsEpic(todoList, lastDone, answer);
			expect(listToMarks(todoList)).equals(
				"[o] [ ] [o] [ ] [x] [ ] [ ] [ ] [ ] [ ]");
		});

		// "Now start again from Tidy Desk (i.e. the last task you did).
		// and ask yourself 'What do I want to do more than Voicemail?'
		// The only task you want to do more than Voicemail is Back Up."
		// review items, saying yes only to last item (in this review it will be the 5th)
		step('should confirm 3 specific items have been marked', () => {
			const answers002 = ['n','n','n','n','y'];
			todoList = conductReviewsEpic(todoList, lastDone, answers002);
			expect(listToMarks(todoList)).equals(
				"[o] [ ] [o] [ ] [x] [ ] [ ] [ ] [ ] [o]");
		});

		// "Do it." (Back Up)
		step('should confirm last item has been done', () => {
			[todoList, lastDone] = conductFocus(
				todoList, lastDone, {workLeft:'n'});
				expect(listToMarks(todoList)).equals(
					"[o] [ ] [o] [ ] [x] [ ] [ ] [ ] [ ] [x]");
				expect(lastDone).equals(todoList[9].header);
		});

		// "There are no further tasks beyond Back Up, so there is no
		// need to check whether you want to do any tasks more than
		// you want to do Voicemail. You just do it."
		step('should confirm last marked item is done next', () => {
			[todoList, lastDone] = conductFocus(
				todoList, lastDone, {workLeft:'n'});
				expect(listToMarks(todoList)).equals(
					"[o] [ ] [x] [ ] [x] [ ] [ ] [ ] [ ] [x]");
				expect(lastDone).equals(todoList[2].header);
		});

		// "You already know that you want to do Email more than In-tray, so you start
		// scanning from the first task after the task you have just done (Voicemail)."
		// "You decide you want to do Make Dental Appointment"
		step('should confirm 3 specific items have been marked', () => {
			const answers003 = ['n','n','y','n','y'];
			todoList = conductReviewsEpic(todoList, lastDone, answers003);
			expect(listToMarks(todoList)).equals(
				"[o] [ ] [x] [ ] [x] [ ] [o] [ ] [o] [x]");
		});

		// As this is the last task on the list you do it immediately,
		// and then do Make Dental Appointment immediately too.
		step('should confirm 4 specific items have been completed', () => {
			[todoList, lastDone] = conductFocus(
				todoList, lastDone, {workLeft:'n'});
			[todoList, lastDone] = conductFocus(
					todoList, lastDone, {workLeft:'n'});
			expect(listToMarks(todoList)).equals(
				"[o] [ ] [x] [ ] [x] [ ] [x] [ ] [x] [x]");
		});
	}); 
});