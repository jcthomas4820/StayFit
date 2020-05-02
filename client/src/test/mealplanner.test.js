import React from "react";
import MealPlanner from "../mealplanner/mealplanner";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<MealPlanner />);
  });
});

describe("grid component", () => {
  it("has a calculate button", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#calculate").exists()).toBeTruthy();
  });

  it("has a generate button", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#generate").exists()).toBeTruthy();
  });

  it("has a view button", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#view").exists()).toBeTruthy();
  });
});
