// issue: Dev determines way to test cli functions, then writes those tests #284
import { expect } from "chai";

// intentionally skipped for now, testing precommit staged linting
describe.skip("test suite", () => {
  it("test case", () => {
    expect(false).equals(true);
  });
});
