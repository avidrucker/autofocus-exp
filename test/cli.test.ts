import { expect } from 'chai';

import { getPluralS, makePrintableTodoItemList } from '../src/cli';
import { addTodoToList } from '../src/main';
import { constructNewTodoItem, ITodoItem } from '../src/todoItem';

describe('Converting a todo item list to a string', () => {
	it('returns an empty string when there are no list items', () => {
		
		let todoList: ITodoItem[] = [];
		const newItem: ITodoItem = constructNewTodoItem(
			"make this app");
		todoList = addTodoToList(todoList,newItem);
		
    expect(makePrintableTodoItemList(todoList)).equals("");
	})

	it('correctly generates 3 lines when there are 3 todo items', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		
    expect(makePrintableTodoItemList(todoList).split("\n").length).equals(3);
	})
})

describe('Pluralization of words', ()=> {
	it('returns word that ends in \'s\' when count is zero', () => {
		const word: string = "cup";
		const count: number = 0;
		const suffix: string = getPluralS(count);
		expect(`${count} ${word}${suffix}`).equals("0 cups");
	})

	it('returns word that doesn\'t end in \'s\' when count is one', () => {
		const word: string = "cup";
		const count: number = 1;
		const suffix: string = getPluralS(count);
		expect(`${count} ${word}${suffix}`).equals("1 cup");
	})

	it('returns word that ends in \'s\' when count not one or zero', () => {
		const word: string = "cup";
		const count: number = 5;
		const suffix: string = getPluralS(count);
		expect(`${count} ${word}${suffix}`).equals("5 cups");
	})
})