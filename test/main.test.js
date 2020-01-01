"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const main_1 = require("../src/main");
describe.skip('Husky', () => {
    it('should prevent repo from being pushed when tests fail', () => {
        chai_1.expect(true).equals(false);
    });
});
describe('Greet User', () => {
    it('should say "Welcome to AutoFocus!"', () => {
        const greeting = main_1.greetUser();
        chai_1.expect(greeting).equals('Welcome to AutoFocus!');
    });
});
