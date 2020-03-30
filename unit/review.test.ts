import { expect } from "chai";

import { readyToReview, setupReview } from "../src/review";
import { ITodoItem, TodoState } from "../src/todoItem";
import { getFirstUnmarked } from "../src/todoList";
import { FRUITS, makeNItemArray, markAllAs } from "./test-util";

describe("REVIEW MODE UNIT TESTS", () => {
  describe("Finding unmarked todos", () => {
    it("when there is one item, returns the first unmarked item", () => {
      const todoList: ITodoItem[] = makeNItemArray(1);
      expect(todoList.length).equals(1);
      expect(getFirstUnmarked(todoList)).equals(0);
    });

    it("when there are multiple items, returns the first unmarked item", () => {
      const todoList: ITodoItem[] = makeNItemArray(2);
      todoList[0].state = TodoState.Completed;
      expect(getFirstUnmarked(todoList)).equals(1);
    });

    it("returns -1 when there are no todos", () => {
      const todoList: ITodoItem[] = makeNItemArray(0);
      expect(getFirstUnmarked(todoList)).equals(-1);
    });

    it("returns -1 when there are no unmarked todos", () => {
      let todoList: ITodoItem[] = makeNItemArray(2);
      todoList = markAllAs(todoList, TodoState.Completed);
      expect(getFirstUnmarked(todoList)).equals(-1);
    });

    it("when there are both marked and unmarked items, returns the unmarked item", () => {
      const todoList: ITodoItem[] = makeNItemArray(2);
      todoList[0].state = TodoState.Marked;
      todoList[1].state = TodoState.Unmarked;
      expect(getFirstUnmarked(todoList)).equals(1);
    });
  });

  // issue: Dev refactors WET code to be more DRY #248
  describe("Ready to review check", () => {
    it("determines list `[o][o][o]` NOT ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      todoList = markAllAs(todoList, TodoState.Marked);
      expect(readyToReview(todoList)).equals(false);
    });

    it("determines list `[x][x][x]` NOT ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      todoList = markAllAs(todoList, TodoState.Completed);
      expect(readyToReview(todoList)).equals(false);
    });

    it("determines list `[x][x][o]` NOT ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      todoList = markAllAs(todoList, TodoState.Completed);
      todoList[2].state = TodoState.Marked;
      expect(readyToReview(todoList)).equals(false);
    });

    it("determines list `[x][o][ ]` ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      let cmwtd: string = "";
      let lastDone = "";
      todoList[0].state = TodoState.Completed;
      lastDone = todoList[0].header;
      [todoList, cmwtd] = setupReview(todoList, cmwtd);
      expect(cmwtd).equals(FRUITS[1]);
      expect(readyToReview(todoList)).equals(true);
      expect(lastDone).equals(FRUITS[0]);
    });

    it("determines list `[x][ ][ ]` ready for review", () => {
      const todoList: ITodoItem[] = makeNItemArray(3);
      todoList[0].state = TodoState.Completed;
      expect(readyToReview(todoList)).equals(true);
    });
  });
});
