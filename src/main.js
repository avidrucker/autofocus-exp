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
const menuPrompt = 'What would you like to do?';
const promptUserWithMainMenu = () => {
    const selection = menuChoices[readline_sync_1.default.keyInSelect(menuChoices, menuPrompt, { cancel: false })];
    // print(`Your menu choice was: ${selection}`);
    return selection;
};
exports.main = () => {
    print(exports.greetUser());
    let running = true;
    while (running) {
        const answer = promptUserWithMainMenu();
        if (answer === MainMenuChoice.Quit) {
            running = false;
        }
    }
    print("Have a nice day!");
};
