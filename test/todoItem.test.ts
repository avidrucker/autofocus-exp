import { expect } from 'chai';

import { constructNewTodoItem, ITodoItem, TodoState, undot } from '../src/todoItem';

describe('TODO ITEM TESTS', () => {
	describe('Creating a new item', () => {
		it('should create an item of state Unmarked', () => {
			const newItem: ITodoItem = constructNewTodoItem(
				"eat some cheese");
			
			expect(newItem.state).equals(TodoState.Unmarked);
			});
	});

	describe('Undotting', () => {
		it('should undot dotted items', () => {
			// make one marked item
			let aItem: ITodoItem = constructNewTodoItem("a");
			aItem.state = TodoState.Marked;
			aItem = undot(aItem); // run undot
			expect(aItem.state).equals(TodoState.Unmarked);
		})
		it('should leave unmarked items as is', () => {
			// make one unmarked item
			let aItem: ITodoItem = constructNewTodoItem("a");
			aItem = undot(aItem); // run undot
			// confirm mark is as it was initially
			expect(aItem.state).equals(TodoState.Unmarked);
		})
		it('should leave completed items as is', () => {
			// make one completed item
			let aItem: ITodoItem = constructNewTodoItem("a");
			aItem.state = TodoState.Completed;
			aItem = undot(aItem);// run undot()
			// confirm mark is as it was initially
			expect(aItem.state).equals(TodoState.Completed);
		})
	})
})