import React from "react";
import MealPlannerView from "./mealplannerview";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<MealPlannerView />);
  });
});

describe("grid component", () => {
  -test.todo("displays the breakfast meal information");
  -test.todo("displays the breakfast meal recipe link");
  -test.todo("displays the lunch meal information");
  -test.todo("displays the lunch meal recipe link");
  -test.todo("displays the dinner meal information");
  -test.todo("displays the dinner meal recipe link");
  -test.todo("displays the nutrient information");
});
