"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../src/index");
describe('Greet User', () => {
    it('should say "Welcome to AutoFocus!"', () => {
        const greeting = index_1.greetUser();
        chai_1.expect(greeting).equals('Welcome to AutoFocus!');
    });
});
describe('Husky', () => {
    it('should prevent repo from being pushed when tests fail', () => {
        chai_1.expect(true).equals(false);
    });
});
