import readlineSync from 'readline-sync';

const APP_NAME = 'AutoFocus';

export const greetUser = (word: string = APP_NAME): string => {
  return `Welcome to ${APP_NAME}!`;
}

// tslint:disable-next-line:no-console
console.log(greetUser());

// todo: remove manual test after running
// Wait for user's response.
const userName = readlineSync.question('May I have your name? ');
// tslint:disable-next-line:no-console
console.log('Hi ' + userName + '!');