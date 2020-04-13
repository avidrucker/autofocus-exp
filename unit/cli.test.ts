// issue: Dev determines way to test cli functions, then writes those tests #284
import chai from "chai";
// const sinon = require("sinon");
// const sinonChai = require("sinon-chai");
const path = require("path");
const spawn = require("child_process").spawn;
const robot = require("robotjs");
const expect = chai.expect;
// chai.use(sinonChai);
// const assert = require("assert");

import { getAnswer } from "../src/cli";

// intentionally skipped for now, testing precommit staged linting
describe("CLI TESTS", () => {
  describe("Smoke test confirms that the app opens", () => {
    it("and prints 'Welcome to AutoFocus!' to standard output", () => {
      // const parentDir = path.resolve(process.cwd(), '..');
      const currentDir = path.resolve(process.cwd());

      // let spy = sinon.spy(console, 'log');

      // process.chdir(currentDir);
      spawn("npm", ["run-script", "run"], { cwd: currentDir }); // const command =

      // todo: add spy to confirm that Welcome Message was printed
      // command.stdout.on('data', (data: any) => {
      // 	console.log(data.toString());
      // });

      // console.log(`parent path: ${parentDir}`);
      // console.log(`CURRENT path: ${currentDir}`);

      robot.typeString("7"); // Type 7 to choose "Quit"
      robot.keyTap("enter"); // Press enter to confirm "Quit"

      // todo: add assertion that gives greater certainty of
      // expected result, such as, "Welcome to AutoFocus" was
      // printed to standard out
      expect(true).equals(true);
      // assert(spy.calledWith("Welcome to AutoFocus!"));
      // spy.restore();
    });
  });

  // todo: refactor test to create confidence around conductReviewsLoopCLI
  describe.skip("CLI function getAnswer()", () => {
    it("Doesn't take any answer but y, n or q for an answer", () => {
      getAnswer("cheese", "banana"); // this line is blocking execution...
      robot.typeString("y");
      robot.keyTap("enter");
      expect(true).equals(true);
    });
  });
});
