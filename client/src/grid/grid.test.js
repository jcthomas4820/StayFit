import React from "react";
import Grid from "./grid";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<Grid />);
  });
});

describe("grid component", () => {
  test.todo("has a gender input");
  test.todo("has an age input");
  test.todo("has a weight input");
  test.todo("has a height input");
  test.todo("has an activity level input");
  test.todo("correctly updates after a user inputs an exercise");
  test.todo("correctly updates after a user edits an exercise");
  test.todo("correctly updates after a user deletes an exercise");
});
