import { expect } from 'chai';
import { greetUser } from '../src/main';

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