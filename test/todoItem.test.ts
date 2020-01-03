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