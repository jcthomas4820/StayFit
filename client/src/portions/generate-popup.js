import React from "react";
import axios from "axios";
import { Header2, Body, Button, Input, CustomModal } from "../styles/custom";
import { Row } from "simple-flexbox";

axios.defaults.withCredentials = true;

class GenerateModal extends React.Component {
  constructor() {
    super();
    this.state = {
      timeFrame: "day",
      diet: "",
      exclude: "",
      genErr: "",
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

  handleClick(e) {
    let id = e.target.id;

    if (id === "generate") {
      let data = {
        cals: this.props.userCals,
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
            console.log(err)
            this.setState({ genErr: err });
          } else {
            this.setState({ modalVisible: false });
            window.location.reload(false);
            axios.post("http://localhost:3001/meal/save-recipes", data)     //  save recipes for each generated meal
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
        <Row horizontal="center">
          <Header2>Generate Meal Plan</Header2>
        </Row>
        <Row horizontal="center">
          <Body style={{ color: "gray" }}>
            Fill in the following (if applicable) or just press generate!
          </Body>
        </Row>
        <br />
        <Row horizontal="center">
          <Body>
            <b>Select a diet:</b>
          </Body>
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
          <Body>
            <b>Foods to exclude (comma-separated): </b>
          </Body>
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
          <Button onClick={this.closeModal}>cancel</Button>
        </Row>
      </CustomModal>
    );
  }
}

export default GenerateModal;
