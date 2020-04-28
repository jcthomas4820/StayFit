import React from "react";
import axios from "axios";
import Navbar from "../portions/navbar";
import RecipeDesc from "../portions/recipe-desc";

axios.defaults.withCredentials = true;

//  allow user to calculate their recommended daily macros
class LunchViewer extends React.Component {
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
    axios.get("http://localhost:3001/meal/GET-LUNCH-ROUTE").then((res) => {
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
      <div className="LunchViewer">
        <Navbar id="navigationBar" />
        <RecipeDesc
          meal="Lunch Recipe"
          ingredients={this.state.ingredients}
          instructions={this.state.instructions}
          err={this.state.recipeErr}
        />
      </div>
    );
  }
}

export default LunchViewer;
