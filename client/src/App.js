import React, { Component } from "react";
import LoginPage from "./logout/login";
import HomePage from "./login/selection";
import MealPlanner from "./mealplanner/mealplanner";
import MealPlannerGenerate from "./mealplanner/mealplannergenerate";
import MealPlannerView from "./mealplanner/mealplannerview";
import Grid from "./grid/grid";
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
          <Route path="/planner-generate" component={MealPlannerGenerate} />
          <Route path="/planner-view" component={MealPlannerView} />
        </div>
      </Router>
    );
  }
}

export default App;
