import { expect } from 'chai';

import { addTodoToList, conductFocus, conductReviews, 
	getFirstReadyTodo, greetUser, indexOfItem, itemExists, listToMarks, readyToReview, setupReview } from '../src/main';
import { constructNewTodoItem, ITodoItem, TodoState } from '../src/todoItem';

// a smoke test, of sorts
// this is to be left skipped normally
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

describe('Adding a new item to the list', () => {
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

describe('Finding items in a list', () => {
	it('should return the first unmarked item', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		const firstItemIndex = indexOfItem(todoList, "state", TodoState.Unmarked);
		expect(firstItemIndex).equals(1);
	})

	it('should find no unmarked items when all items are completed', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		todoList[1].state = TodoState.Completed;
		todoList[2].state = TodoState.Completed;
		const containsUnmarked = itemExists(todoList, "state", TodoState.Unmarked)
		expect(containsUnmarked).equals(false);
	})

	it('enables determining when reviewing is not possible because no reviewable items exist', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		todoList[1].state = TodoState.Completed;
		todoList[2].state = TodoState.Completed;
		expect(readyToReview(todoList)).equals(false);
	})

	it('correctly finds the first ready todo item', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		todoList[1].state = TodoState.Completed;
		expect(readyToReview(todoList)).equals(true);
	})
})

describe('Finding ready todos', () => {
	it('returns the first ready item', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList[0].state = TodoState.Completed;
		expect(getFirstReadyTodo(todoList)).equals(1);
	})
})

describe('Initializing list iteration', () => {
  it('should result in the first item being dotted if it wasn\'t already', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		[todoList, cmwtd] = setupReview(todoList, cmwtd);
    expect(todoList[0].state).equals(TodoState.Marked);
	});

	it('should marked the first non-complete, non-archived item', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		[todoList, cmwtd] = setupReview(todoList, cmwtd);
    expect(todoList[1].state).equals(TodoState.Marked);
	});
});

describe('List to marks function', () => {
	it('should return a list of items marked `[o] [ ]` for a given list', () => {
		let todoList: ITodoItem[] = [];
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList[0].state = TodoState.Marked;
		expect(listToMarks(todoList)).equals("[o] [ ]");
	})
})

describe('Conducting list iteration', () => {
  it('should return a list of items marked `[o] [ ] [o]` for input `n, y` ', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		[todoList, cmwtd] = setupReview(todoList, cmwtd);
		[todoList, cmwtd] = conductReviews(todoList, cmwtd, ['n', 'y']);
		expect(listToMarks(todoList)).equals("[o] [ ] [o]");
	});

	it('should correctly update CMWTD for input `n, y` ', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		[todoList, cmwtd] = setupReview(todoList, cmwtd);
		[todoList, cmwtd] = conductReviews(todoList, cmwtd, ['n', 'y']);
		expect(cmwtd).equals("cherry");
	});
});

describe('Entering focus mode', ()=> {
	it('when there are no todo items does not affect the todo list or cmwtd', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		[todoList, cmwtd] = conductFocus(todoList, cmwtd, {workLeft: 'y'}); // "There are no todo items."
		expect(todoList.length).equals(0);
		expect(cmwtd).equals("");
	});

	it('when there are no marked items doesn\'t affect the todo list of cmwtd', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		todoList = addTodoToList(todoList,item1);
		[todoList, cmwtd] = conductFocus(todoList, cmwtd, {workLeft: 'y'}); // "The CMWTD has not been set."
		expect(todoList.length).equals(1);
		expect(cmwtd).equals("");
	})
});

describe('Entering review mode,', ()=> {
	it('when there are no todo items, does not affect the todo list or cmwtd', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no todo items."
		[todoList, cmwtd] = conductReviews(todoList, cmwtd, []); // "There are no todo items."
		expect(todoList.length).equals(0);
		expect(cmwtd).equals("");
	});

	it('when there are no unmarked or ready items, doesn\'t affect the todo list or cmwtd', () => {
		let todoList: ITodoItem[] = [];
		let cmwtd = "";
		const item1: ITodoItem = constructNewTodoItem("apple");
		const item2: ITodoItem = constructNewTodoItem("banana");
		const item3: ITodoItem = constructNewTodoItem("cherry");
		todoList = addTodoToList(todoList,item1);
		todoList = addTodoToList(todoList,item2);
		todoList = addTodoToList(todoList,item3);
		todoList[0].state = TodoState.Completed;
		todoList[1].state = TodoState.Completed;
		todoList[2].state = TodoState.Completed;
		[todoList, cmwtd] = setupReview(todoList, cmwtd); // "There are no ready items."
		[todoList, cmwtd] = conductReviews(todoList, cmwtd, []); // "There are no ready items."
		expect(todoList.length).equals(3);
		expect(cmwtd).equals("");
	});
});

/*
describe('', ()=> {
	it('', () => {
		expect(listToMarks(todoList)).equals("[o] [ ] [o]");
	})
})
*/