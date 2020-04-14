/*
Form written as controlled component:
    MacroCalculator component randers the form and controls what happens in that form
*/

import React from "react";
import axios from "axios";
import Navbar from "../layouts/navbar";
import { Redirect } from "react-router-dom";
import { Header1, Button, Input, Body } from "../styles/custom";
import { Row, Column } from "simple-flexbox";

axios.defaults.withCredentials = true;

//  allow user to calculate their recommended daily macros
class MealPlannerGenerate extends React.Component {
  constructor() {
    super();
    this.state = {
      userCals: "",
      timeFrame: "day",
      diet: "",
      exclude: "",
      genErr: "",
      canView: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //  function handles text changes in textbox on form
  //  allows any form changes to appear in the form
  handleChange(e) {
    const name = e.target.name; //  name of html element changed
    const value = e.target.value; //  value of html element changed

    switch (name) {
      case "diet":
        this.setState({ diet: value });
        break;
      case "exclude":
        this.setState({ exclude: value });
        break;
      default:
        return;
    }
  }

  //  function used to handle calculate calories
  handleClick(e) {
    let id = e.target.id;

    if (id === "generate") {
      let data = {
        cals: this.state.userCals,
        timeFrame: this.state.timeFrame,
        diet: this.state.diet,
        exclude: this.state.exclude,
      };
      //  perform backend generate operation
      axios
        .post("http://localhost:3001/meal/generate-meal-plan", data)
        .then((res) => {
          let err = res.data.errMsg;

          if (err) {
            this.setState({ genErr: err });
          } else {
            // allow them to redirect to view the meal plan
            this.setState({ canView: true });
          }
        });
    }
  }

  componentWillMount() {
    //  perform backend operation to get the user's calories
    axios.get("http://localhost:3001/cal/get-cal-rec").then((res) => {
      let err = res.data.errMsg;

      if (err) {
        this.setState({ genErr: err });
      } else {
        // update the calories
        this.setState({ userCals: res.data.userCals });
      }
    });
  }

  //  note: radio buttons only allow one selection per name attribute
  render() {
    if (this.state.canView === true) {
      return <Redirect push to="/planner-view" />;
    }

    return (
      <div className="MealPlannerGenerate">
        <Navbar />
        <Column flexGrow={1}>
          <Row horizontal="center">
            <Header1>Generate Meal Plan</Header1>
          </Row>
          <Row horizontal="center">
            <Body>Select a diet: </Body>
            <Row flexGrow={0} horizontal="center">
              <input
                name="diet"
                type="radio"
                value="Gluten Free"
                onChange={this.handleChange}
              />
              <Body>Gluten free</Body>
            </Row>
            <Row flexGrow={0} horizontal="center">
              <input
                name="diet"
                type="radio"
                value="Ketogenic"
                onChange={this.handleChange}
              />
              <Body>Ketogenic</Body>
            </Row>
            <Row flexGrow={0} horizontal="center">
              <input
                name="diet"
                type="radio"
                value="Vegatarian"
                onChange={this.handleChange}
              />
              <Body>Vegatarian</Body>
            </Row>
            <Row flexGrow={0} horizontal="center">
              <input
                name="diet"
                type="radio"
                value="Vegan"
                onChange={this.handleChange}
              />
              <Body>Vegan</Body>
            </Row>
            <Row flexGrow={0} horizontal="center">
              <input
                name="diet"
                type="radio"
                value="Pescetarian"
                onChange={this.handleChange}
              />
              <Body>Pescetarian</Body>
            </Row>
          </Row>
          <br />
          <Row horizontal="center">
            <Body>Foods to exclude (comma-separated): </Body>
          </Row>
          <Row horizontal="center">
            <Input
              id="exclude"
              type="text"
              name="exclude"
              placeholder="ex: shellfish, olives"
              onChange={this.handleChange}
            ></Input>
          </Row>

          <br />
          <Row horizontal="center">
            <Button id="generate" onClick={this.handleClick}>
              generate
            </Button>
          </Row>
        </Column>
      </div>
    );
  }
}

export default MealPlannerGenerate;
