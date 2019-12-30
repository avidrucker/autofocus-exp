"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const APP_NAME = 'AutoFocus';
exports.greetUser = (word = APP_NAME) => {
    return `Welcome to ${APP_NAME}!`;
};
console.log(exports.greetUser());
