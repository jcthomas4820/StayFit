import React from "react";
import Grid from "../grid/grid";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<Grid />);
  });
});

describe("grid component", () => {
  it("contains the navigation bar", () => {
    const wrapper = shallow(<Grid />);
    expect(wrapper.find("#navigationBar").exists()).toBeTruthy();
  });

  it("contains popup to edit or delete rows", () => {
    const wrapper = shallow(<Grid />);
    expect(wrapper.find("#editdelete").exists()).toBeTruthy();
    expect(wrapper.find("#edit").exists()).toBeTruthy();
    expect(wrapper.find("#delete").exists()).toBeTruthy();
    expect(wrapper.find("#cancel").exists()).toBeTruthy();
  });

  it("contains popup to edit rows", () => {
    const wrapper = shallow(<Grid />);
    wrapper.setState({ willEdit: true });
    expect(wrapper.find("#editentry").exists()).toBeTruthy();
    expect(wrapper.find("#name").exists()).toBeTruthy();
    expect(wrapper.find("#description").exists()).toBeTruthy();
    expect(wrapper.find("#date").exists()).toBeTruthy();
    expect(wrapper.find("#editSave").exists()).toBeTruthy();
    expect(wrapper.find("#cancel").exists()).toBeTruthy();
  });
});
