import React from "react";
import MealPlanner from "./mealplanner";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<MealPlanner />);
  });
});

describe("grid component", () => {
  it("has an age input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#age").exists()).toBeTruthy();
  });

  it("has a weight input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#weight").exists()).toBeTruthy();
  });

  it("has a height input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#height").exists()).toBeTruthy();
  });

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

  it("has a male gender input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#genderM").exists()).toBeTruthy();
  });

  it("has a female gender input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#genderF").exists()).toBeTruthy();
  });

  it("has a sedentary activity level input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#s").exists()).toBeTruthy();
  });

  it("has a lightly active activity level input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#la").exists()).toBeTruthy();
  });

  it("has a moderately active activity level input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#ma").exists()).toBeTruthy();
  });

  it("has a very active activity level input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#va").exists()).toBeTruthy();
  });

  it("has an extremely active activity level input", () => {
    const wrapper = shallow(<MealPlanner />);
    expect(wrapper.find("#ea").exists()).toBeTruthy();
  });

  test.todo(
    "tells the user to calculate their calories if they don't have any"
  );
  test.todo("updates the user's calories once they have been calculated");
});
