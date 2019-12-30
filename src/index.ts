const APP_NAME = 'AutoFocus';

export const greetUser = (word: string = APP_NAME): string => {
  return `Welcome to ${APP_NAME}!`;
}

// tslint:disable-next-line:no-console
console.log(greetUser());
