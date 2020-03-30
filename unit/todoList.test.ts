import { expect } from "chai";

import { constructNewTodoItem, ITodoItem, TodoState } from "../src/todoItem";
import {
  addTodoToList,
  indexOfItem,
  itemExists,
  makePrintableTodoItemList
} from "../src/todoList";
import { makeNItemArray, markAllAs } from "./test-util";

describe("TODO LIST UNIT TESTS", () => {
  describe("Adding a new item to the list", () => {
    it("should increase the todo item count by 1", () => {
      let todoList: ITodoItem[] = [];
      const before: number = todoList.length;
      const newItem: ITodoItem = constructNewTodoItem("vaccuum my room"); // , "using the mini-vac"
      todoList = addTodoToList(todoList, newItem);
      const after: number = todoList.length;

      expect(after).equals(before + 1);
    });
  });

  describe("Finding items in a list", () => {
    it("should return the first unmarked item", () => {
      const todoList: ITodoItem[] = makeNItemArray(3);
      todoList[0].state = TodoState.Completed;
      const firstItemIndex = indexOfItem(todoList, "state", TodoState.Unmarked);
      expect(firstItemIndex).equals(1);
    });

    it("should find no unmarked items when all items are completed", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      todoList = markAllAs(todoList, TodoState.Completed);
      const containsUnmarked = itemExists(
        todoList,
        "state",
        TodoState.Unmarked
      );
      expect(containsUnmarked).equals(false);
    });
  });

  describe("Converting a todo item list to a string", () => {
    it("returns msg 'no list items to print' when list is empty", () => {
      const todoList: ITodoItem[] = [];

      expect(makePrintableTodoItemList(todoList)).equals(
        "There are no todo items to print."
      );
    });

    it("returns correct single string output when only one list item exists", () => {
      let todoList: ITodoItem[] = [];
      const newItem: ITodoItem = constructNewTodoItem("make this app");
      todoList = addTodoToList(todoList, newItem);

      expect(makePrintableTodoItemList(todoList)).equals("[ ] make this app");
    });

    it("correctly generates 3 lines when there are 3 todo items", () => {
      const todoList: ITodoItem[] = makeNItemArray(3);
      expect(makePrintableTodoItemList(todoList).split("\n").length).equals(3);
    });
  });
});
