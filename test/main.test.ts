import { expect } from 'chai';

import { greetUser } from '../src/main';

// a smoke test, of sorts
// this is to be left skipped normally
describe.skip('Husky', () => {
  it('should prevent repo from being pushed when tests fail', () => {

    expect(true).equals(false);
  });
});

describe('Greet User', () => {
  it('should say "Welcome to AutoFocus!"', () => {
		const greeting: string = greetUser();
		
    expect(greeting).equals('Welcome to AutoFocus!');
  });
});

/*
describe('', ()=> {
	it('', () => {
		expect(listToMarks(todoList)).equals("[o] [ ] [o]");
	})
})
*/