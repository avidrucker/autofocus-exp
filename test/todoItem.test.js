"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const todoItem_1 = require("../src/todoItem");
describe('Creating, adding a new item', () => {
    it('should increase the todo item count by 1', () => {
        const todoList = [];
        const before = todoList.length;
        const newItem = todoItem_1.constructNewTodoItem("vaccuum my room", "using the mini-vac");
        todoList.push(newItem);
        const after = todoList.length;
        chai_1.expect(after).equals(before + 1);
    });
    it('should create an item of state Unmarked', () => {
        const newItem = todoItem_1.constructNewTodoItem("eat some cheese");
        chai_1.expect(newItem.state).equals(todoItem_1.TodoState.Unmarked);
    });
});
// TODO: evaluate necessity of print unit test
describe.skip('Printing a todo item list', () => {
    it('does nothing when there are no list items', () => {
        // printTodoItemList()
    });
    it('correctly prints 3 lines when there are 3 todo items', () => {
        // printTodoItemList()
    });
});
