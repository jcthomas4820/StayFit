import React, { Component } from 'react';
import LoginPage from './logout/login'
import SelectionPage from './login/selection'
import MacroCalculator from './calculator/calculator'
import NutritionTracker from './tracker/tracker'

class App extends Component {
  render() {
    //return <div>StayFit! Application<p>Fun stuff to come!</p></div>;
  
      return(
        <div className="App">
          <NutritionTracker />
        </div>
      )
  
  }
}

export default App;
