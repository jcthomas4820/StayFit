import React from "react";
import axios from "axios";
import {
  Header2,
  Body,
  CustomModal,
  Button,
  Input,
  Error,
} from "../styles/custom";
import { Row } from "simple-flexbox";

axios.defaults.withCredentials = true;

class CalculateModal extends React.Component {
  constructor() {
    super();
    this.state = {
      gender: "",
      age: "",
      weight: "",
      height: "",
      activityLevel: "",
      errMsg: "",
      modalVisible: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
  }

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

  handleClick(e) {
    let id = e.target.id;

    if (id === "calculate") {
      // grab the user data
      let gender = this.state.gender;
      let age = this.state.age;
      let weight = this.state.weight;
      let height = this.state.height;
      let activityLevel = this.state.activityLevel;

      const userData = {
        userGender: gender,
        userAge: age,
        userWeight: weight,
        userHeight: height,
        userActivityLevel: activityLevel,
      };

      // send user entered data to the server to calculate the required data
      axios
        .post("http://localhost:3001/cal/save-cal-rec", userData)
        .then((res) => {
          // grab data returned by server

          let err = res.data.errMsg;

          if (err) {
            this.setState({ errorMsg: err });
          } else {
            // close the pop up
            // refresh the page
            this.setState({ modalVisible: false });
            window.location.reload(false);
          }
        });
    }
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  componentDidMount() {
    CustomModal.setAppElement("body");
  }

  render() {
    //  display the selection screen, containing buttons to load each component
    // target="_blank" opens a new tab   width: 650px; height: 300px;
    return (
      <CustomModal isOpen={this.state.modalVisible} onHide={this.closeModal}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Header2>Calculate your calories</Header2>
        </div>
        <Row horizontal="center">
          <Error>{this.state.errorMsg}</Error>
        </Row>
        <Row horizontal="center">
          <Row flexGrow={0} horizontal="center">
            <Body>
              <b>Gender:</b>
            </Body>
          </Row>
          <Row flexGrow={0} horizontal="center">
            <input
              id="genderM"
              name="gender"
              type="radio"
              value="male"
              onChange={this.handleChange}
            />
            <Body>Male</Body>
          </Row>
          <Row flexGrow={0} horizontal="center">
            <input
              id="genderF"
              name="gender"
              type="radio"
              value="female"
              onChange={this.handleChange}
            />
            <Body>Female</Body>
          </Row>
        </Row>
        <br />
        <Row horizontal="center">
          <Input
            id="age"
            type="text"
            name="age"
            placeholder="age"
            onChange={this.handleChange}
          ></Input>
          <Input
            id="weight"
            type="text"
            name="weight"
            placeholder="weight (lb)"
            onChange={this.handleChange}
          ></Input>
          <Input
            id="height"
            type="text"
            name="height"
            placeholder="height (in)"
            onChange={this.handleChange}
          ></Input>
        </Row>
        <br />
        <Row horizontal="center">
          <Body>
            <b>Activity Level:</b>
          </Body>
        </Row>
        <Row horizontal="center">
          <input
            id="s"
            name="activityLevel"
            type="radio"
            value="sedentary"
            onChange={this.handleChange}
          />{" "}
          <Body>Sedentary: Little to no exercise</Body>
        </Row>
        <Row horizontal="center">
          <input
            id="la"
            name="activityLevel"
            type="radio"
            value="lightly active"
            onChange={this.handleChange}
          />{" "}
          <Body>
            Lightly Active: Exercise for at least 20 minutes 1 to 3 times per
            week
          </Body>
        </Row>
        <Row horizontal="center">
          <input
            id="ma"
            name="activityLevel"
            type="radio"
            value="moderately active"
            onChange={this.handleChange}
          />{" "}
          <Body>
            Moderately Active: Intensive exercise for at least 30 to 60 minutes
            3 to 4 times per week
          </Body>
        </Row>
        <Row horizontal="center">
          <input
            id="va"
            name="activityLevel"
            type="radio"
            value="very active"
            onChange={this.handleChange}
          />{" "}
          <Body>
            Very Active: Intensive exercise for 60 minutes or greater 5 to 7
            days per week
          </Body>
        </Row>
        <Row horizontal="center">
          <input
            id="ea"
            name="activityLevel"
            type="radio"
            value="extra active"
            onChange={this.handleChange}
          />{" "}
          <Body>
            Extra Active: Exceedingly active and/or very demanding activities
          </Body>
        </Row>
        <Row horizontal="center">
          <Button id="calculate" onClick={this.handleClick}>
            calculate calories
          </Button>
          <Button onClick={this.closeModal}>cancel</Button>
        </Row>
      </CustomModal>
    );
  }
}

export default CalculateModal;
