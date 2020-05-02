import React from "react";
import GeneratePopUp from "../portions/generate-popup";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<GeneratePopUp />);
  });
});

describe("popup component", () => {
  it("has input for diet preference - gluten free", () => {
    const wrapper = shallow(<GeneratePopUp />);
    expect(wrapper.find("#glutenfree").exists()).toBeTruthy();
  });

  it("has input for diet preference - keto", () => {
    const wrapper = shallow(<GeneratePopUp />);
    expect(wrapper.find("#keto").exists()).toBeTruthy();
  });

  it("has input for diet preference - vegetarian", () => {
    const wrapper = shallow(<GeneratePopUp />);
    expect(wrapper.find("#veg").exists()).toBeTruthy();
  });

  it("has input for diet preference - vegan", () => {
    const wrapper = shallow(<GeneratePopUp />);
    expect(wrapper.find("#vegan").exists()).toBeTruthy();
  });

  it("has input for diet preference - pescetarian", () => {
    const wrapper = shallow(<GeneratePopUp />);
    expect(wrapper.find("#pesc").exists()).toBeTruthy();
  });

  it("has input for foods to exclude", () => {
    const wrapper = shallow(<GeneratePopUp />);
    expect(wrapper.find("#exclude").exists()).toBeTruthy();
  });

  it("has a generate button", () => {
    const wrapper = shallow(<GeneratePopUp />);
    expect(wrapper.find("#generate").exists()).toBeTruthy();
  });

  it("has a cancel button", () => {
    const wrapper = shallow(<GeneratePopUp />);
    expect(wrapper.find("#cancel").exists()).toBeTruthy();
  });
});

// it("has an age input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#age").exists()).toBeTruthy();
// });

// it("has a weight input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#weight").exists()).toBeTruthy();
// });

// it("has a height input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#height").exists()).toBeTruthy();
// });

// it("has a calculate button", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#calculate").exists()).toBeTruthy();
// });

// it("has a generate button", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#generate").exists()).toBeTruthy();
// });

// it("has a view button", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#view").exists()).toBeTruthy();
// });

// it("has a male gender input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#genderM").exists()).toBeTruthy();
// });

// it("has a female gender input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#genderF").exists()).toBeTruthy();
// });

// it("has a sedentary activity level input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#s").exists()).toBeTruthy();
// });

// it("has a lightly active activity level input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#la").exists()).toBeTruthy();
// });

// it("has a moderately active activity level input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#ma").exists()).toBeTruthy();
// });

// it("has a very active activity level input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#va").exists()).toBeTruthy();
// });

// it("has an extremely active activity level input", () => {
//   const wrapper = shallow(<MealPlanner />);
//   expect(wrapper.find("#ea").exists()).toBeTruthy();
// });
