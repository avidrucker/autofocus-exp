import { expect } from 'chai';

import { addTodoToList, greetUser } from '../src/main';
import { constructNewTodoItem, ITodoItem } from '../src/todoItem';

describe.skip('Husky', () => {
  it('should prevent repo from being pushed when tests fail', () => {

    expect(true).equals(false);
  });
});

describe('Greet User', () => {
  it('should say "Welcome to AutoFocus!"', () => {
		const greeting: string = greetUser();
		
    expect(greeting).equals('Welcome to AutoFocus!');
  });
});

describe('Creating a new item', () => {
  it('should increase the todo item count by 1', () => {
		let todoList: ITodoItem[] = [];
		const before:number = todoList.length;
		const newItem: ITodoItem = constructNewTodoItem(
			"vaccuum my room"); // , "using the mini-vac"
		todoList = addTodoToList(todoList,newItem);
		const after:number = todoList.length;
		
    expect(after).equals(before + 1);
	});
});