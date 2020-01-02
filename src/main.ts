import readlineSync from 'readline-sync';

const APP_NAME = 'AutoFocus';

export const greetUser = (word: string = APP_NAME): string => {
  return `Welcome to ${APP_NAME}!`;
}

const print = (s: string):void => {
	// tslint:disable-next-line:no-console
	console.log(s);
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

enum TodoState {
	Unmarked,
	Marked,
	Completed,
	Archived
}

interface ITodoItem {
	created: string;
	modified: string;
	uuid: string;
	header: string;
	body?: string;
	state: TodoState;
}

const todoList: ITodoItem[] = [];

// todo_AD3: in 071: create constants over entire file as needed
// next, dev consolidates constant variables at the top of file
const newItemTitlePrompt = "Give your todo item a name (ie. wash the \
dishes) then hit the ENTER key to confirm. Or, type ‘Q’ and hit \
ENTER to quit: ";
const newItemBodyPrompt = "Give your todo item a comment (ie. use \
dishwasher for non-glass items) or hit ENTER key to skip: ";

export const promptUserForNewTodoItem = (): ITodoItem | null => {
	const titleText = readlineSync.question(newItemTitlePrompt);
	let bodyText = "";
	if(titleText.toLowerCase() === 'q') {
		return null;
	} else {
		bodyText = readlineSync.question(newItemBodyPrompt);

		// todo_AD1: in 071, place down temp ITodoItem field data created, modified
		// Next, dev implements momentjs datetime for created & modified fields.
		// todo_AD2: in 071, place down temp ITodoItem field data uuid
		// Next, dev implements uuid w/ conventional method (datetime + random digit).
		const newItem: ITodoItem = {
			body: bodyText,
			created:"temp_created_date",
			header: titleText,
			modified:"temp_created_date",
			state: TodoState.Unmarked,
			uuid:"temp_unique_universal_identifier"
		}

		print(`New todo item '${newItem.header}' successfully created!`)

		return newItem;
	}
}

const printTodoItemCount = ():void => {
	let plural = "";
	if(todoList.length !== 1) {
		plural = "s";
	}
	print(`You have ${todoList.length} todo item${plural}.`);
}

export const main = ():void => {
	print(greetUser());

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
				printTodoItemCount();
			}
		}
		if(answer === MainMenuChoice.Quit) {
			running = false;
		}
	}
	
	print("Have a nice day!");
}