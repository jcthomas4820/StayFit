import React from "react";
import axios from "axios";
import Navbar from "../portions/navbar";
import { Header1, Header2, Body, Error } from "../styles/custom";
import { Row, Column } from "simple-flexbox";

axios.defaults.withCredentials = true;

//  allow user to calculate their recommended daily macros
class DinnerViewer extends React.Component {
  constructor() {
    super();
    this.state = {
      recipeErr: "",
      ingredients: [],
      instructions: [],
    };
  }

  componentWillMount() {
    // Load the recipe information for the user
    // It will expect an array with the ingredients, and an array with the instructions
    // LET ME KNOW IF U NEED HELP PARSING OUT THE DATA ON THE BACKEND/FRONTEND
    /*
    axios.get("http://localhost:3001/meal/GET-DINNER-ROUTE").then((res) => {
      let err = res.data.errMsg;

      if (err) {
        this.setState({ recipeErr: err });
      } else {
        this.setState({ ingredients: res.data.ingredients });
        this.setState({ instructions: res.data.instructions });
      }
    });
    */
  }

  //  note: radio buttons only allow one selection per name attribute
  render() {
    return (
      <div className="DinnerViewer">
        <Navbar id="navigationBar" />
        <Column flexGrow={1}>
          <Row horizontal="center">
            <Header1>Dinner Recipe</Header1>
          </Row>
          <Row horizontal="center">
            <Error>{this.state.err}</Error>
          </Row>
          <Row vertical="center">
            <Column flexGrow={2} horizontal="center">
              <Row horizontal="center">
                <Header2>
                  <u>What you need</u>
                </Header2>
              </Row>
              <ul>
                {this.state.ingredients.map(function (item, index) {
                  return (
                    <Row>
                      <Body>
                        <li key={index}>{item}</li>
                      </Body>
                    </Row>
                  );
                })}
              </ul>
            </Column>
            <Column flexGrow={2} horizontal="center">
              <Header2>
                <u>What you need to follow</u>
              </Header2>
              <ol>
                {this.state.instructions.map(function (item, index) {
                  return (
                    <Row>
                      <Body>
                        <li key={index}>{item}</li>
                      </Body>
                    </Row>
                  );
                })}
              </ol>
            </Column>
          </Row>
        </Column>
      </div>
    );
  }
}

export default DinnerViewer;
