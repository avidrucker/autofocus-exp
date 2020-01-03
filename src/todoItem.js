"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("./utility");
var TodoState;
(function (TodoState) {
    TodoState[TodoState["Unmarked"] = 0] = "Unmarked";
    TodoState[TodoState["Marked"] = 1] = "Marked";
    TodoState[TodoState["Completed"] = 2] = "Completed";
    TodoState[TodoState["Archived"] = 3] = "Archived";
})(TodoState = exports.TodoState || (exports.TodoState = {}));
exports.constructNewTodoItem = (headerText, bodyText = "", stateIn = TodoState.Unmarked) => {
    const newItem = {
        body: bodyText,
        created: "temp_created_date",
        header: headerText,
        modified: "temp_created_date",
        state: stateIn,
        uuid: "temp_unique_universal_identifier"
    };
    return newItem;
};
exports.printTodoItemCount = (list) => {
    let plural = "";
    if (list.length !== 1) {
        plural = "s";
    }
    utility_1.print(`You have ${list.length} todo item${plural}.`);
};
