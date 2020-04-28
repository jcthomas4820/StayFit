import React from "react";
import axios from "axios";
import Navbar from "../portions/navbar";
import { Header1, Header2, Button } from "../styles/custom";
import { Row } from "simple-flexbox";
import CalculateModal from "../portions/calculate-popup";
import GenerateModal from "../portions/generate-popup";
import ViewModal from "../portions/view-popup";

axios.defaults.withCredentials = true;

//  allow user to calculate their recommended daily macros
class MealPlanner extends React.Component {
  constructor() {
    super();
    this.state = {
      gender: "",
      age: "",
      weight: "",
      height: "",
      activityLevel: "",
      cals: null,
      errorMsg: "",
      calMsg: "", // "Your daily calorie intake should be: <cals here>"
      planWasGenerated: false,
      view: false, // view the meal plan
      calculateLaunch: false,
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
      case "gender":
        this.setState({ gender: value });
        break;
      case "age":
        this.setState({ age: value });
        break;
      case "weight":
        this.setState({ weight: value });
        break;
      case "height":
        this.setState({ height: value });
        break;
      case "activityLevel":
        this.setState({ activityLevel: value });
        break;
      default:
        return;
    }
  }

  // send user entered data to the server to calculate the required data
  //  function used to handle calculate calories
  handleClick(e) {
    let id = e.target.id;
    console.log(id);

    if (id === "calculate") {
      this.refs.calculateModal.showModal();
    } else if (id === "generate") {
      this.refs.generateModal.showModal();
    } else if (id === "view") {
      this.refs.viewModal.showModal();
    }
  }

  componentWillMount() {
    // load each row data from databse for each row, save in state
    axios.get("http://localhost:3001/cal/get-cal-rec").then((res) => {
      let err = res.data.errMsg;

      if (err) {
        this.setState({
          calMsg: "Calculate your calories to use the Meal Planner!",
        });
      } else {
        let userCals = res.data.userCals;
        this.setState({ cals: userCals });
        this.setState({
          calMsg:
            "Your daily calorie intake should be: " +
            this.state.cals +
            " calories",
        });
      }
    });
  }

  //  note: radio buttons only allow one selection per name attribute
  render() {
    return (
      <div className="MealPlanner">
        <Navbar />
        <Row horizontal="center">
          <Header1>Meal Planner</Header1>
        </Row>
        <Row horizontal="center">
          <Header2>{this.state.calMsg}</Header2>
        </Row>
        <br />
        <CalculateModal container={this} ref="calculateModal" />
        <GenerateModal
          container={this}
          ref="generateModal"
          userCals={this.state.cals}
        />
        <ViewModal container={this} ref="viewModal" />
        <Row horizontal="center">
          <Button id="calculate" onClick={this.handleClick}>
            calculate calories
          </Button>
          <Button id="generate" onClick={this.handleClick}>
            generate meal plan
          </Button>
          <Button id="view" onClick={this.handleClick}>
            view meal plan
          </Button>
        </Row>
      </div>
    );
  }
}

export default MealPlanner;
