import React, { Component } from "react";
import LoginPage from "./logout/login";
import HomePage from "./login/selection";
import MealPlanner from "./mealplanner/mealplanner";
import Grid from "./grid/grid";
import BreakfastViewer from "./recipeviewer/breakfastviewer";
import LunchViewer from "./recipeviewer/lunchviewer";
import DinnerViewer from "./recipeviewer/dinnerviewer";
import { BrowserRouter as Router } from "react-router-dom";
import Route from "react-router-dom/Route";

class App extends Component {
  render() {
    return (
      //add routes to each component
      <Router>
        <div className="App">
          <Route path="/" exact component={LoginPage} />
          <Route path="/logout" component={LoginPage} />
          <Route path="/home" component={HomePage} />
          <Route path="/grid" component={Grid} />
          <Route path="/planner" component={MealPlanner} />
          <Route path="/view-recipe-breakfast" component={BreakfastViewer} />
          <Route path="/view-recipe-lunch" component={LunchViewer} />
          <Route path="/view-recipe-dinner" component={DinnerViewer} />
        </div>
      </Router>
    );
  }
}

export default App;
