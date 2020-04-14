import React from "react";
import Home from "./selection";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<Home />);
  });
});

describe("selection component", () => {
  it("contains the navigation bar", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("#navigationBar").exists()).toBeTruthy();
  });

  it("provides exercise grid description", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("#exerciseGridDesc").exists()).toBeTruthy();
  });

  it("provides meal planner description", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("#mealPlannerDesc").exists()).toBeTruthy();
  });
});
