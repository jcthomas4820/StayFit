import React from "react";
import MealPlannerGenerate from "./mealplannergenerate";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<MealPlannerGenerate />);
  });
});

describe("grid component", () => {
  test.todo("had inputs for the user's diet preference");
  test.todo("had inputs for the user's food preferences");
  test.todo("redirects the user to view their meal plan when calculated");
});
