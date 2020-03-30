import { assert, expect } from "chai";
import { ITodoItem } from "../src/todoItem";
import { makeNItemArray, throwBadInputError } from "./test-util";

describe("TEST UTILITY TESTS", () => {
  describe("Creating a todo list of n length", () => {
    // test with none
    it("results in 0 length list with no input", () => {
      const todoList: ITodoItem[] = makeNItemArray();
      expect(todoList.length).equals(0);
    });

    // test with 0
    it("results in 0 length list with 0 input", () => {
      const todoList: ITodoItem[] = makeNItemArray(0);
      expect(todoList.length).equals(0);
    });

    // test with 1
    it("results in 1 length list with 1 input", () => {
      const todoList: ITodoItem[] = makeNItemArray(1);
      expect(todoList.length).equals(1);
    });

    // test with few
    it("results in 2 length list with 2 input", () => {
      const todoList: ITodoItem[] = makeNItemArray(2);
      expect(todoList.length).equals(2);
    });

    // test with many (more than initial array)
    it("results in 5 length list with 5 input", () => {
      const todoList: ITodoItem[] = makeNItemArray(5);
      expect(todoList.length).equals(5);
    });

    // test with bad (negative) input
    it("throws an error with negative input", () => {
      assert.throw(() => makeNItemArray(-1), Error, "Bad input error thrown");
    });
  });

  describe("The bad input error function", () => {
    it("throws a bad input error", () => {
      assert.throw(throwBadInputError, Error, "Bad input error thrown");
    });
  });
});
