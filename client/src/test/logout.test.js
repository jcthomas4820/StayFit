import React from "react";
import Login from "../logout/login";
import { shallow } from "enzyme";

describe("page render", () => {
  it("renders without crashing", () => {
    shallow(<Login />);
  });
});

describe("login/register component", () => {
  it("has a location for the user to enter a username", () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find("#userName").exists()).toBeTruthy();
  });

  it("has a location for the user to enter a password", () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find("#password").exists()).toBeTruthy();
  });

  it("has a login button", () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find("#login").exists()).toBeTruthy();
  });

  it("has a register button", () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find("#register").exists()).toBeTruthy();
  });
});
