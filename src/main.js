"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const APP_NAME = 'AutoFocus';
exports.greetUser = (word = APP_NAME) => {
    return `Welcome to ${APP_NAME}!`;
};
const print = (s) => {
    // tslint:disable-next-line:no-console
    console.log(s);
};
var MainMenuChoice;
(function (MainMenuChoice) {
    MainMenuChoice["AddNew"] = "Add a New Todo";
    MainMenuChoice["ReviewTodos"] = "Review & Dot Todos";
    MainMenuChoice["EnterFocus"] = "Enter Focus Mode";
    MainMenuChoice["ReadAbout"] = "Read About AutoFocus";
    MainMenuChoice["Quit"] = "Quit Program";
})(MainMenuChoice || (MainMenuChoice = {}));
const menuChoices = [
    MainMenuChoice.AddNew,
    MainMenuChoice.ReviewTodos,
    MainMenuChoice.EnterFocus,
    MainMenuChoice.ReadAbout,
    MainMenuChoice.Quit
];
const menuPrompt = 'Please choose from the menu above:';
const promptUserWithMainMenu = () => {
    const selection = menuChoices[readline_sync_1.default.keyInSelect(menuChoices, menuPrompt, { cancel: false })];
    // print(`Your menu choice was: ${selection}`);
    return selection;
};
var TodoState;
(function (TodoState) {
    TodoState[TodoState["Unmarked"] = 0] = "Unmarked";
    TodoState[TodoState["Marked"] = 1] = "Marked";
    TodoState[TodoState["Completed"] = 2] = "Completed";
    TodoState[TodoState["Archived"] = 3] = "Archived";
})(TodoState || (TodoState = {}));
const todoList = [];
// todo_AD3: in 071: create constants over entire file as needed
// next, dev consolidates constant variables at the top of file
const newItemTitlePrompt = "Give your todo item a name (ie. wash the \
dishes) then hit the ENTER key to confirm. Or, type ‘Q’ and hit \
ENTER to quit: ";
const newItemBodyPrompt = "Give your todo item a comment (ie. use \
dishwasher for non-glass items) or hit ENTER key to skip: ";
exports.promptUserForNewTodoItem = () => {
    const titleText = readline_sync_1.default.question(newItemTitlePrompt);
    let bodyText = "";
    if (titleText.toLowerCase() === 'q') {
        return null;
    }
    else {
        bodyText = readline_sync_1.default.question(newItemBodyPrompt);
        // todo_AD1: in 071, place down temp ITodoItem field data created, modified
        // Next, dev implements momentjs datetime for created & modified fields.
        // todo_AD2: in 071, place down temp ITodoItem field data uuid
        // Next, dev implements uuid w/ conventional method (datetime + random digit).
        const newItem = {
            body: bodyText,
            created: "temp_created_date",
            header: titleText,
            modified: "temp_created_date",
            state: TodoState.Unmarked,
            uuid: "temp_unique_universal_identifier"
        };
        print(`New todo item '${newItem.header}' successfully created!`);
        return newItem;
    }
};
const printTodoItemCount = () => {
    let plural = "";
    if (todoList.length !== 1) {
        plural = "s";
    }
    print(`You have ${todoList.length} todo item${plural}.`);
};
exports.main = () => {
    print(exports.greetUser());
    // todo_AD4: in 071, put main program loop inside of main function
    // Next, dev extracts out pieces of main program loop into
    // atomic functions which they can then compose main function with.
    let running = true;
    while (running) {
        const answer = promptUserWithMainMenu();
        if (answer === MainMenuChoice.AddNew) {
            const temp = exports.promptUserForNewTodoItem();
            if (temp !== null) {
                todoList.push(temp);
                printTodoItemCount();
            }
        }
        if (answer === MainMenuChoice.Quit) {
            running = false;
        }
    }
    print("Have a nice day!");
};
