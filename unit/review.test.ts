import { expect } from "chai";

import { readyToReview, setupReview, getLastDoneIndex } from "../src/review";
import { ITodoItem, TodoState } from "../src/todoItem";
import { getFirstUnmarked, listToMarks, getCMWTD } from "../src/todoList";
import { FRUITS, makeNItemArray, markAllAs } from "./test-util";
import { conductFocus } from "../src/focus";

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
    it("determines list `[o] [o] [o]` NOT ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      todoList = markAllAs(todoList, TodoState.Marked);
      expect(listToMarks(todoList)).equals("[o] [o] [o]");
      expect(readyToReview(todoList)).equals(false);
    });

    it("determines list `[x] [x] [x]` NOT ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      todoList = markAllAs(todoList, TodoState.Completed);
      expect(listToMarks(todoList)).equals("[x] [x] [x]");
      expect(readyToReview(todoList)).equals(false);
    });

    it("determines list `[x] [x] [o]` NOT ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      todoList = markAllAs(todoList, TodoState.Completed);
      todoList[2].state = TodoState.Marked;
      expect(listToMarks(todoList)).equals("[x] [x] [o]");
      expect(readyToReview(todoList)).equals(false);
    });

    it("determines list `[x] [o] [ ]` ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      let lastDone = "";
      todoList[0].state = TodoState.Completed;
      lastDone = todoList[0].header;
      todoList = setupReview(todoList);
      expect(getCMWTD(todoList)).equals(FRUITS[1]);
      expect(listToMarks(todoList)).equals("[x] [o] [ ]");
      expect(readyToReview(todoList)).equals(true);
      expect(lastDone).equals(FRUITS[0]);
    });

    it("determines list `[x] [ ] [ ]` ready for review", () => {
      const todoList: ITodoItem[] = makeNItemArray(3);
      todoList[0].state = TodoState.Completed;
      expect(listToMarks(todoList)).equals("[x] [ ] [ ]");
      expect(readyToReview(todoList)).equals(true);
    });

    it("determines list `[o] [ ] [o]` NOT ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      todoList[0].state = TodoState.Marked;
      todoList[2].state = TodoState.Marked;
      expect(listToMarks(todoList)).equals("[o] [ ] [o]");
      expect(readyToReview(todoList)).equals(false);
    });

    it("determines list `[o] [ ] [o] [ ]` ready for review", () => {
      let todoList: ITodoItem[] = makeNItemArray(4);
      todoList[0].state = TodoState.Marked;
      todoList[2].state = TodoState.Marked;
      expect(listToMarks(todoList)).equals("[o] [ ] [o] [ ]");
      expect(readyToReview(todoList)).equals(true);
    });

    it("determines list `[x] [o] [ ]` ready for review", () => {
      const todoList: ITodoItem[] = makeNItemArray(3);
      todoList[0].state = TodoState.Completed;
      todoList[1].state = TodoState.Marked;
      expect(listToMarks(todoList)).equals("[x] [o] [ ]");
      expect(readyToReview(todoList)).equals(true);
    });
  });

  describe("Determining the last done index", () => {
    it("gets the correct index as last done", () => {
      let todoList: ITodoItem[] = makeNItemArray(3);
      let lastDone = "";
      todoList = setupReview(todoList);
      [todoList, lastDone] = conductFocus(todoList, lastDone, {
        workLeft: "n"
      });
      expect(getLastDoneIndex(todoList, lastDone)).equals(0);
      expect(listToMarks(todoList)).equals("[x] [ ] [ ]");
    });
  });
});
