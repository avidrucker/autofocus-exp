import { expect } from 'chai';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';

describe('Creating, adding a new item', () => {
  	it('should increase the todo item count by 1', () => {
		const todoList: ITodoItem[] = [];
		const before:number = todoList.length;
		const newItem: ITodoItem = constructNewTodoItem(
			"vaccuum my room", "using the mini-vac");
		todoList.push(newItem);
		const after:number = todoList.length;
		
    	expect(after).equals(before + 1);
  });
	
	it('should create an item of state Unmarked', () => {
		const newItem: ITodoItem = constructNewTodoItem(
			"eat some cheese");
		
		expect(newItem.state).equals(TodoState.Unmarked);
	  });
});

// TODO: evaluate necessity of print unit test
describe.skip('Printing a todo item list', () => {
	it('does nothing when there are no list items', () => {
		// printTodoItemList()
	})

	it('correctly prints 3 lines when there are 3 todo items', () => {
		// printTodoItemList()
	})

})