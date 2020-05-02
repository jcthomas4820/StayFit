import React from "react";
import axios from "axios";
import { Header2, Body, CustomModal, Button, Error } from "../styles/custom";
import { Row, Column } from "simple-flexbox";
import { Redirect } from "react-router-dom";

axios.defaults.withCredentials = true;

class ViewModal extends React.Component {
  constructor() {
    super();
    this.state = {
      mealErr: "",
      breakfast: {},
      lunch: {},
      dinner: {},
      nutrition: {},
      modalVisible: false,

      breakfastView: false,
      lunchView: false,
      dinnerView: false,
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  componentWillMount() {
    // Load the meal information for the user
    // for example:
    //  load list from database, assign state as follows:
    // response: { breakfast: {name: "Name", readyIn: " x Minutes", servings: 4},
    //             lunch: {name: "Name", readyIn: " x Minutes", servings: 4},
    //             dinner: {name: "Name", readyIn: " x Minutes", servings: 4},
    //             nutritionInfo: {calories: "cals", carbs: "carbs", protein: "protein", fat: "fat"} }
    //  let breakfast = res.data.breakfast
    //  let lunch = res.data.lunch
    //  let dinner = res.data.dinner
    //  let nutrition = res.data.nutritionInfo
    // set the states of all of this info

    axios.get("http://localhost:3001/meal/get-meal-plan").then((res) => {
      let err = res.data.errMsg;

      if (err) {
        this.setState({ mealErr: err });
      } else {
        this.setState({ breakfast: res.data.bfast });
        this.setState({ lunch: res.data.lunch });
        this.setState({ dinner: res.data.dinner });
        this.setState({ nutrition: res.data.nutrients });
      }
    });
  }

  handleClick(e) {
    let id = e.target.id;

    if (id === "breakfast") {
      this.setState({ breakfastView: true });
    } else if (id === "lunch") {
      this.setState({ lunchView: true });
    } else if (id === "dinner") {
      this.setState({ dinnerView: true });
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
    if (this.state.breakfastView === true) {
      this.setState({ breakfastView: false });
      return <Redirect push to="/view-recipe-breakfast" />;
    } else if (this.state.lunchView === true) {
      this.setState({ lunchView: false });
      return <Redirect push to="/view-recipe-lunch" />;
    } else if (this.state.dinnerView === true) {
      this.setState({ dinnerView: false });
      return <Redirect push to="/view-recipe-dinner" />;
    } else {
      //  display the selection screen, containing buttons to load each component
      // target="_blank" opens a new tab   width: 650px; height: 300px;
      return (
        <div className="ViewModal">
          {this.state.mealErr === "" ? (
            <CustomModal
              isOpen={this.state.modalVisible}
              onHide={this.closeModal}
            >
              <Column flexGrow={1}>
                <Row horizontal="center">
                  <Header2>View Meal Plan</Header2>
                </Row>
                <Row horizontal="center">
                  <Error>{this.state.mealErr}</Error>
                </Row>
                <Row horizontal="center">
                  <Column flexGrow={1} horizontal="center">
                    <Body>
                      <b>Breakfast</b>
                    </Body>
                    <Body>{this.state.breakfast.name}</Body>
                    <Body>
                      Ready in: {this.state.breakfast.readyIn} minutes
                    </Body>
                    <Body>Servings: {this.state.breakfast.servings}</Body>
                    <Button id="breakfast" onClick={this.handleClick}>
                      view recipe
                    </Button>
                  </Column>

                  <Column flexGrow={1} horizontal="center">
                    <Body>
                      <b>Lunch</b>
                    </Body>
                    <Body>{this.state.lunch.name}</Body>
                    <Body>Ready in: {this.state.lunch.readyIn} minutes</Body>
                    <Body>Servings: {this.state.lunch.servings}</Body>
                    <Button id="lunch" onClick={this.handleClick}>
                      view recipe
                    </Button>
                  </Column>

                  <Column flexGrow={1} horizontal="center">
                    <Body>
                      <b>Dinner</b>
                    </Body>
                    <Body>{this.state.dinner.name}</Body>
                    <Body>Ready in: {this.state.dinner.readyIn} minutes</Body>
                    <Body>Servings: {this.state.dinner.servings}</Body>
                    <Button id="dinner" onClick={this.handleClick}>
                      view recipe
                    </Button>
                  </Column>
                </Row>
                <br />
                <br />
                <Row horizontal="center">
                  <Column flexGrow={1} horizontal="center">
                    <Body>
                      <b>Nutrients</b>
                    </Body>
                    <Body>Calories: {this.state.nutrition.calories}</Body>
                    <Body>Carbs: {this.state.nutrition.carbs}</Body>
                    <Body>Fat: {this.state.nutrition.fat}</Body>
                    <Body>Protein: {this.state.nutrition.protein}</Body>
                  </Column>
                </Row>
              </Column>
              <br />
              <br />
              <Row horizontal="center">
                <Button id="cancel" onClick={this.closeModal}>
                  close
                </Button>
              </Row>
            </CustomModal>
          ) : (
            <CustomModal
              isOpen={this.state.modalVisible}
              onHide={this.closeModal}
            >
              <Row horizontal="center">
                <Header2>View Meal Plan</Header2>
              </Row>
              <Row horizontal="center">
                <Error>{this.state.mealErr}</Error>
              </Row>
              <br />
              <br />
              <Row horizontal="center">
                <Button id="cancel" onClick={this.closeModal}>
                  close
                </Button>
              </Row>
            </CustomModal>
          )}
        </div>
      );
    }
  }
}

export default ViewModal;
