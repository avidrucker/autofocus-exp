import readlineSync from 'readline-sync';

import {constructNewTodoItem, ITodoItem, printTodoItemCount, printTodoItemList, TodoState} from './todoItem';

import {print} from './utility';

const APP_NAME = 'AutoFocus';

export const greetUser = (word: string = APP_NAME): string => {
  return `Welcome to ${APP_NAME}!`;
}

enum MainMenuChoice {
	AddNew = 'Add a New Todo',
	ReviewTodos = 'Review & Dot Todos',
	EnterFocus = 'Enter Focus Mode',
	ReadAbout = 'Read About AutoFocus',
	Quit = 'Quit Program'
}

const menuChoices: MainMenuChoice[] = [
	MainMenuChoice.AddNew,
	MainMenuChoice.ReviewTodos,
	MainMenuChoice.EnterFocus,
	MainMenuChoice.ReadAbout,
	MainMenuChoice.Quit];
	
const menuPrompt = 'Please choose from the menu above:';

const promptUserWithMainMenu = (): MainMenuChoice => {
	const selection: MainMenuChoice = menuChoices[readlineSync.keyInSelect(menuChoices, menuPrompt, {cancel: false})];
	// print(`Your menu choice was: ${selection}`);
	return selection;
}

// todo_AD3: in 071: create constants over entire file as needed
// next, dev consolidates constant variables at the top of file
const newItemTitlePrompt = "Give your todo item a name (ie. wash the \
dishes) then hit the ENTER key to confirm. Or, type 'Q' and hit \
ENTER to quit: ";
const newItemBodyPrompt = "Give your todo item a comment (ie. use \
dishwasher for non-glass items) or hit ENTER key to skip: ";

const promptUserForNewTodoItem = (): ITodoItem | null => {
	const headerText = readlineSync.question(newItemTitlePrompt, {
		limit: /\w+/i,
		limitMessage: 'Sorry, $<lastInput> is not a valid todo item title'
	}); // prevent empty input
	let bodyText = "";
	if(headerText.toLowerCase() === 'q') {
		return null;
	} else {
		bodyText = readlineSync.question(newItemBodyPrompt);

		// todo_AD1: in 071, place down temp ITodoItem field data created, modified
		// Next, dev implements momentjs datetime for created & modified fields.
		// todo_AD2: in 071, place down temp ITodoItem field data uuid
		// Next, dev implements uuid w/ conventional method (datetime + random digit).
		const newItem: ITodoItem = constructNewTodoItem(
			headerText, bodyText);

		print(`New todo item '${newItem.header}' successfully created!`);

		return newItem;
	}
}

export const main = ():void => {
	print(greetUser());

	const todoList: ITodoItem[] = [];

	// todo_AD4: in 071, put main program loop inside of main function
	// Next, dev extracts out pieces of main program loop into
	// atomic functions which they can then compose main function with.
	let running = true;
	while(running) {
		const answer = promptUserWithMainMenu();
		if(answer === MainMenuChoice.AddNew) {
			const temp: ITodoItem | null = promptUserForNewTodoItem();
			if(temp !== null) {
				todoList.push(temp);
				// todo_AD5: in 071, put state mutation directly in main program loop
				// Next, dev implements todo item store using redux pattern
				printTodoItemCount(todoList);
			}
		}

		if(answer === MainMenuChoice.ReviewTodos) {
			print("Your Todo List:")
			printTodoItemList(todoList);
		}

		if(answer === MainMenuChoice.Quit) {
			running = false;
		}
	}
	
	print("Have a nice day!");
}