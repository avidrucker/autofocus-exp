import { expect } from 'chai';

import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';

describe('TODO ITEM TESTS', () => {
	describe('Creating a new item', () => {
		it('should create an item of state Unmarked', () => {
			const newItem: ITodoItem = constructNewTodoItem(
				"eat some cheese");
			
			expect(newItem.state).equals(TodoState.Unmarked);
			});
	});
})