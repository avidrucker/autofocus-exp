import readlineSync from 'readline-sync';

import {constructNewTodoItem, ITodoItem, printTodoItemCount, printTodoItemList, TodoState} from './todoItem';

import {generalPrint} from './utility';

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

const promptUserForYNQ = (questionString: string): string => {
	return readlineSync.question(questionString, {limit: ['y','n','q','Y','N','Q']}).toLowerCase();
}

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

		generalPrint(`New todo item '${newItem.header}' successfully created!`);

		return newItem;
	}
}

export const main = ():void => {
	generalPrint(greetUser());

	const todoList: ITodoItem[] = [];
	let cmwtd: string = "";

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
			// todo_AD6: in 095, implement review of todo items where
			// it is assumed that 2 or more items exist in todo list
			// Next, dev implements safety guards which prevent review
			// of todos from occurring where there are 0 or 1 items only,
			// instead, printing a message "You have no todo items yet!"
			// or "Marking the only todo item in your list 'todo item title'",
			// respectively.
			
			// following the AutoFocus algorithm
			// step 1: dot the first item
			todoList[0].state = TodoState.Marked;
			cmwtd = todoList[0].header; // Q_AD_001 // CMWTD is initialized to first item
			generalPrint(`Dotting first item '${cmwtd}' ...\n`)

			generalPrint("Your Todo List:")
			printTodoItemList(todoList);

			// todo_AD7: in 095, in 095, implement review of todo items where
			// it is assumed that 2 or more items exist in todo list
			// Next, dev implements non-acceptable answer to be interpretted
			// as a 'do you want to quit?' option to accomodate users who
			// have either malfactioning keyboards or physical impairments.
			
			// step 2: for each item after the first, the user is asked,
			// do you want to do list[current index + 1] more than 
			// list[current_index]? to which they can answer yes, no, or
			// quit ('Y','N','Q').
			
			// todo_AD8: in 095, in 095, implement review of todo items where
			// it is assumed that 2 or more items exist in todo list
			// Next, dev implements E2E test using simulated user / automated
			// command line input.
			
			// todo_AD9: in 095, in 095, implement review of todo items where
			// program & functions within assume command line input
			// Next, dev implements redux state pattern (or rxjs) to enable
			// platform, time, & input method agnostic state updates and
			// therefor also modularized, atomic functions, which are not
			// tightly coupled with user input systems.
			
			for(let i = 0; i < todoList.length - 1; i++) {
				const current = todoList[i].header;
				const next = todoList[i+1].header;
				const ans = promptUserForYNQ(`Do you want to '${next}' more than '${cmwtd}'? (Y/N/Q) `);
				// 'y','n','q'
				if(ans === 'y') {
					todoList[i+1].state = TodoState.Marked;
					generalPrint(`Marking '${todoList[i+1].header}'...`);
					cmwtd = todoList[i+1].header; // Q_AD_001: question to architect: ought this be uuid? todo: post question as issue
					generalPrint(`Setting current most want to do to '${todoList[i+1].header}'.`);
				}
				if(ans === 'n') {
					generalPrint(`Understood.`)
				}
				if(ans === 'q') {
					generalPrint('Discontinuing the review process early ...')
					break;
				}
			}
			
			generalPrint(`You have finished reviewing ${todoList.length} items!`)
			generalPrint(`Your current most want to do is '${cmwtd}'.`);
			
		}

		if(answer === MainMenuChoice.Quit) {
			running = false;
		}
	}
	
	generalPrint("Have a nice day!");
}