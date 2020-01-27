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

// issue: Dev moves all constants to top of file #102
const newItemTitlePrompt = "Give your todo item a name (ie. wash the \
dishes) then hit the ENTER key to confirm. Or, type 'Q' and hit \
ENTER to quit: ";
//// 113. const newItemBodyPrompt = "Give your todo item a comment (ie. use \
//// dishwasher for non-glass items) or hit ENTER key to skip: ";

const promptUserForYNQ = (questionString: string): string => {
	return readlineSync.question(questionString, {limit: ['y','n','q','Y','N','Q']}).toLowerCase();
}

const promptUserForNewTodoItem = (): ITodoItem | null => {
	const headerText = readlineSync.question(newItemTitlePrompt, {
		limit: /\w+/i,
		limitMessage: 'Sorry, $<lastInput> is not a valid todo item title'
	}); // prevent empty input
	//// 113. let bodyText = "";
	if(headerText.toLowerCase() === 'q') {
		return null;
	} else {
		//// 113. bodyText = readlineSync.question(newItemBodyPrompt);

		// issue: Dev implements momentjs datetime #103
		// issue: Dev implements ITodoItem uuid #104
		const newItem: ITodoItem = constructNewTodoItem(
			headerText, ""); //// 113. bodyText

		generalPrint(`New todo item '${newItem.header}' successfully created!`);

		return newItem;
	}
}

export const main = ():void => {
	generalPrint(greetUser());

	const todoList: ITodoItem[] = [];
	let cmwtd: string = "";

	// issue: Dev extracts all non-func code from main #105
	let running = true;
	while(running) {
		const answer = promptUserWithMainMenu();
		if(answer === MainMenuChoice.AddNew) {
			const temp: ITodoItem | null = promptUserForNewTodoItem();
			if(temp !== null) {
				todoList.push(temp);
				// issue: Dev implements todo item store using redux pattern #106
				printTodoItemCount(todoList);
			}
		}

		if(answer === MainMenuChoice.ReviewTodos) {
			// issue: Dev handles for list review when there are 2 or less items #107
			
			// following the AutoFocus algorithm
			// step 1: dot the first item
			// issue: Dev fixes issue where first item is perma-marked #116
			todoList[0].state = TodoState.Marked;
			cmwtd = todoList[0].header; // CMWTD is initialized to first item // issue: Architect decides how to manage todo items in backend #108
			generalPrint(`Dotting first item '${cmwtd}' ...\n`)

			generalPrint("Your Todo List:")
			printTodoItemList(todoList);

			// issue: Architect designs option to always quit mid-menu #109
			
			// step 2: for each item after the first, the user is asked,
			// do you want to do list[current index + 1] more than 
			// list[current_index]? to which they can answer yes, no, or
			// quit ('Y','N','Q').
			
			// issue: Dev implements E2E test for CLA #110
			// issue: Dev implements todo item store using redux pattern #106
			
			for(let i = 0; i < todoList.length - 1; i++) {
				const current = todoList[i].header;
				const next = todoList[i+1].header;
				const ans = promptUserForYNQ(`Do you want to '${next}' more than '${cmwtd}'? (Y/N/Q) `);
				// 'y','n','q'
				if(ans === 'y') {
					todoList[i+1].state = TodoState.Marked;
					generalPrint(`Marking '${todoList[i+1].header}'...`);
					cmwtd = todoList[i+1].header; // Architect decides how to manage todo items in backend #108
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
			
			// issue: Dev removes "finished" text after list review #117
			generalPrint(`You have finished reviewing ${todoList.length} items!`)
			generalPrint(`Your current most want to do is '${cmwtd}'.`);

			// issue: Dev prints out full list of todo items w/ marks #118
			
		}

		// issue: Dev extracts main menu choice code #119
		if(answer === MainMenuChoice.EnterFocus) {
			// 1. clear the console view
			// tslint:disable-next-line:no-console
			console.clear();

			// 2. show the current todo item
			generalPrint(`You are working on '${cmwtd}'`);

			// 3. wait for any key to continue
			readlineSync.keyInPause();

			// 4. ask the user if they have work left to do on current item
			const makeDupTodo = promptUserForYNQ(`Do you have work left to do on this item?`);
			// If there is work left to do on the cmwtd item, a duplicate issue is created.
			if(makeDupTodo.toLowerCase() === 'y') {
				const newItem: ITodoItem = constructNewTodoItem(
					cmwtd, "")
				todoList.push(newItem);
			}

			// 5. mark the cmwtd item as done
			// note: since cmwtd is current saved as a string, string lookup
			// of todo items is the way to find the cmwtd in the todoItem list
			let searching = true;
			let i = 0;
			while(searching) {
				// find an item that match the header text of the
				// current-most-want-to-do AND hasn't been completed yet
				if(todoList[i].header === cmwtd && todoList[i].state !== TodoState.Completed) {
					todoList[i].state = TodoState.Completed;
					searching = false;
				}
				i = i+1;
			}

		}

		if(answer === MainMenuChoice.Quit) {
			running = false;
		}
	}
	
	generalPrint("Have a nice day!");
}