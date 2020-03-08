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

		step('should confirm 3 items have been marked', () => {
			[todoList, cmwtd] = setupReview(todoList, cmwtd);
			const answers001 = ['y','y'];
			[todoList, cmwtd] = conductReviews(todoList, cmwtd, answers001);
			expect(listToMarks(todoList)).equals("[o] [o] [o]");
		});

		step('should confirm 3rd item has been completed',() => {
			[todoList, cmwtd] = conductFocus(todoList, cmwtd, {workLeft: "n"});
			expect(todoList[2].state).equals(TodoState.Completed);
		});
	});
});