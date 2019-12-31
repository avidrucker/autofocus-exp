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
// tslint:disable-next-line:no-console
console.log(exports.greetUser());
// todo: remove manual test after running
// Wait for user's response.
const userName = readline_sync_1.default.question('May I have your name? ');
// tslint:disable-next-line:no-console
console.log('Hi ' + userName + '!');
