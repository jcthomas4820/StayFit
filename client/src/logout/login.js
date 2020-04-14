import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import { Row, Column } from "simple-flexbox";
import { Header1, Button, Error, Input } from "../styles/custom";

axios.defaults.withCredentials = true;

//  allow user to login/register
class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      loginError: true,
      needsToRegister: false,
      errorMessage: null,
      username: "",
      password: "",
    };
    this.handleClick = this.handleClick.bind(this); //  required for binding handleClick function to use this state
  }

  // If a user was already logged in, say there were no login
  // errors and send them directly to the selection page
  componentWillMount() {
    axios.get("http://localhost:3001/api/").then((res) => {
      let status = res.data.status;

      if (status === "Not logged in") {
        this.setState({ loginError: true });
      } else {
        this.setState({ loginError: false });
      }
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClick(e) {
    let id = e.target.id;
    console.log(id);
    if (id === "login") {
      const returningUser = {
        username: this.state.username,
        password: this.state.password,
      };

      axios
        .post("http://localhost:3001/api/login", returningUser)
        .then((res) => {
          let err = res.data.logError;

          if (err) {
            this.setState({ errorMessage: err });
            this.setState({ loginError: true });
          } else {
            this.setState({ errorMessage: null });
            this.setState({ loginError: false });
          }
        });
    } else if (id === "register") {
      const newUser = {
        username: this.state.username,
        password: this.state.password,
      };

      axios.post("http://localhost:3001/api/register", newUser).then((res) => {
        let err = res.data.regError;
        if (err) {
          this.setState({ errorMessage: err });
          this.setState({ loginError: true });
        } else {
          this.setState({ errorMessage: null });
          this.setState({ loginError: false });
        }
      });
    }
  }

  render() {
    //  when no errors in logging in/registering, direct user to selection page
    if (!this.state.loginError) {
      return <Redirect push to="/home" />;
    }

    //  login page, displays errors if present
    return (
      <div className="LoginPage">
        <Column flexGrow={1}>
          <Row horizontal="center">
            <Header1>Welcome to StayFit!</Header1>
          </Row>
          <div className="login/register section">
            <Row horizontal="center">
              <Error>{this.state.errorMessage}</Error>
            </Row>
            <Row horizontal="center">
              <Input
                id="userName"
                type="text"
                name="username"
                placeholder="username"
                value={this.state.username}
                onChange={(e) => this.handleChange(e)}
              ></Input>
            </Row>
            <Row horizontal="center">
              <Input
                id="password"
                type="text"
                name="password"
                placeholder="password"
                value={this.state.password}
                onChange={(e) => this.handleChange(e)}
              ></Input>
            </Row>
          </div>
          <div className="login/register buttons">
            <Row horizontal="center">
              <Button id="login" onClick={this.handleClick}>
                login
              </Button>
            </Row>
            <Row horizontal="center">
              <Button id="register" onClick={this.handleClick}>
                register
              </Button>
            </Row>
          </div>
        </Column>
      </div>
    );
  }
}

export default LoginPage;

// <Row horizontal='center'><Button id="register" onClick={this.handleClick}>register</Button></Row>
