import React from "react";
import axios from "axios";
import { Header1, Header2, Body, Error } from "../styles/custom";
import { Row, Column } from "simple-flexbox";

axios.defaults.withCredentials = true;

class RecipeDesc extends React.Component {
  constructor() {
    super();
    this.state = {
      meal: "",
      ingredients: [],
      instructions: [],
      err: "",
    };
  }

  componentWillMount() {
    this.setState({ meal: this.props.meal });
    this.setState({ ingredients: this.props.ingredients });
    this.setState({ instructions: this.props.instructions });
    this.setState({ err: this.props.err });
  }

  render() {
    //  display the selection screen, containing buttons to load each component
    // target="_blank" opens a new tab   width: 650px; height: 300px;
    return (
      <div className="RecipeDesc">
        <Column flexGrow={1}>
          <Row horizontal="center">
            <Header1>{this.state.meal}</Header1>
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

export default RecipeDesc;
