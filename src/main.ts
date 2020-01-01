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
	
const menuPrompt = 'What would you like to do?';

const promptUserWithMainMenu = (): MainMenuChoice => {
	const selection: MainMenuChoice = menuChoices[readlineSync.keyInSelect(menuChoices, menuPrompt, {cancel: false})];
	// print(`Your menu choice was: ${selection}`);
	return selection;
}

export const main = ():void => {
	print(greetUser());

	let running = true;
	while(running) {
		const answer = promptUserWithMainMenu();
		if(answer === MainMenuChoice.Quit) {
			running = false;
		}
	}
	
	print("Have a nice day!");
}