import React from "react";
import CalculatePopUp from "../portions/calculate-popup";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<CalculatePopUp />);
  });
});

describe("popup component", () => {
  it("has an age input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#age").exists()).toBeTruthy();
  });

  it("has a weight input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#weight").exists()).toBeTruthy();
  });

  it("has a height input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#height").exists()).toBeTruthy();
  });

  it("has a calculate button", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#calculate").exists()).toBeTruthy();
  });

  it("has a cancel button", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#cancel").exists()).toBeTruthy();
  });

  it("has a male gender input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#genderM").exists()).toBeTruthy();
  });

  it("has a female gender input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#genderF").exists()).toBeTruthy();
  });

  it("has a sedentary activity level input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#s").exists()).toBeTruthy();
  });

  it("has a lightly active activity level input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#la").exists()).toBeTruthy();
  });

  it("has a moderately active activity level input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#ma").exists()).toBeTruthy();
  });

  it("has a very active activity level input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#va").exists()).toBeTruthy();
  });

  it("has an extremely active activity level input", () => {
    const wrapper = shallow(<CalculatePopUp />);
    expect(wrapper.find("#ea").exists()).toBeTruthy();
  });
});
