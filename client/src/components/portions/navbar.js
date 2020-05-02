import React from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { Nav, NavHeader, Logo, CustomLink } from "../../styles/custom";

axios.defaults.withCredentials = true;

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: true,
    };

    this.handleLogout = this.handleLogout.bind(this); //  bindings required for binding handleLogout and handleClick function to use this state
  }

  handleLogout() {
    //  perform backend logout operations
    axios.post("http://localhost:3001/api/logout").then((res) => {
      let err = res.data.logoutErr;
      console.log(err);
      if (err === "There is no one logged in" || !err) {
        this.setState({ loggedIn: false });
      } else {
        this.setState({ loggedIn: true });
      }
    });
  }

  render() {
    //  if user selects to log out, send back to login screen
    if (!this.state.loggedIn) {
      return <Redirect push to="/logout" />;
    }

    //  display the selection screen, containing buttons to load each component
    // target="_blank" opens a new tab
    return (
      <Nav>
        <NavHeader>
          <Logo>
            <Link to="/home">StayFit!</Link>
          </Logo>
          <CustomLink>
            <Link to="/grid">Exercise Grid</Link>
          </CustomLink>
          <CustomLink>
            <Link to="/planner">Meal Planner</Link>
          </CustomLink>
          <CustomLink>
            <Link to="/logout" onClick={this.handleLogout}>
              Logout
            </Link>
          </CustomLink>
        </NavHeader>
      </Nav>
    );
  }
}

export default Navbar;
