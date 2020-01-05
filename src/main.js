"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const todoItem_1 = require("./todoItem");
const utility_1 = require("./utility");
const APP_NAME = 'AutoFocus';
exports.greetUser = (word = APP_NAME) => {
    return `Welcome to ${APP_NAME}!`;
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
// todo_AD3: in 071: create constants over entire file as needed
// next, dev consolidates constant variables at the top of file
const newItemTitlePrompt = "Give your todo item a name (ie. wash the \
dishes) then hit the ENTER key to confirm. Or, type 'Q' and hit \
ENTER to quit: ";
const newItemBodyPrompt = "Give your todo item a comment (ie. use \
dishwasher for non-glass items) or hit ENTER key to skip: ";
const promptUserForNewTodoItem = () => {
    const headerText = readline_sync_1.default.question(newItemTitlePrompt, {
        limit: /\w+/i,
        limitMessage: 'Sorry, $<lastInput> is not a valid todo item title'
    }); // prevent empty input
    let bodyText = "";
    if (headerText.toLowerCase() === 'q') {
        return null;
    }
    else {
        bodyText = readline_sync_1.default.question(newItemBodyPrompt);
        // todo_AD1: in 071, place down temp ITodoItem field data created, modified
        // Next, dev implements momentjs datetime for created & modified fields.
        // todo_AD2: in 071, place down temp ITodoItem field data uuid
        // Next, dev implements uuid w/ conventional method (datetime + random digit).
        const newItem = todoItem_1.constructNewTodoItem(headerText, bodyText);
        utility_1.print(`New todo item '${newItem.header}' successfully created!`);
        return newItem;
    }
};
exports.main = () => {
    utility_1.print(exports.greetUser());
    const todoList = [];
    // todo_AD4: in 071, put main program loop inside of main function
    // Next, dev extracts out pieces of main program loop into
    // atomic functions which they can then compose main function with.
    let running = true;
    while (running) {
        const answer = promptUserWithMainMenu();
        if (answer === MainMenuChoice.AddNew) {
            const temp = promptUserForNewTodoItem();
            if (temp !== null) {
                todoList.push(temp);
                // todo_AD5: in 071, put state mutation directly in main program loop
                // Next, dev implements todo item store using redux pattern
                todoItem_1.printTodoItemCount(todoList);
            }
        }
        if (answer === MainMenuChoice.ReviewTodos) {
            utility_1.print("Your Todo List:");
            todoItem_1.printTodoItemList(todoList);
        }
        if (answer === MainMenuChoice.Quit) {
            running = false;
        }
    }
    utility_1.print("Have a nice day!");
};
