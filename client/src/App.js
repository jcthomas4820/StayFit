import React, { Component } from 'react';
import LoginPage from './logout/login'
import SelectionPage from './login/selection'
import MacroCalculator from './calculator/calculator'
import NutritionTracker from './tracker/tracker'
import Grid from './grid/grid'
import { BrowserRouter as Router } from 'react-router-dom'
import Route from 'react-router-dom/Route'

class App extends Component {
  render() {

      return(

        //add routes to each component
        <Router>
          <div className="App">
            <Route path='/' exact component={LoginPage} /> 
            <Route path='/logout' component={LoginPage} />
            <Route path='/selection' component={SelectionPage} />   
            <Route path='/calculator' component={MacroCalculator} />  
            <Route path='/grid' component={Grid} />  
            <Route path='/tracker' component={NutritionTracker} />  
          </div>
        </Router>

        )
  
  }
}

export default App;


