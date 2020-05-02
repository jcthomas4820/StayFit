import React from "react";
import ViewPopUp from "../portions/view-popup";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<ViewPopUp />);
  });
});

describe("popup component", () => {
  it("has a button to view breakfast", () => {
    const wrapper = shallow(<ViewPopUp />);
    expect(wrapper.find("#breakfast").exists()).toBeTruthy();
  });

  it("has a button to view lunch", () => {
    const wrapper = shallow(<ViewPopUp />);
    expect(wrapper.find("#lunch").exists()).toBeTruthy();
  });

  it("has a button to view dinner", () => {
    const wrapper = shallow(<ViewPopUp />);
    expect(wrapper.find("#dinner").exists()).toBeTruthy();
  });

  it("has a cancel button", () => {
    const wrapper = shallow(<ViewPopUp />);
    expect(wrapper.find("#cancel").exists()).toBeTruthy();
  });
});
