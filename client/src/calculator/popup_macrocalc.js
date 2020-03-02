import React, { Component } from 'react';
import MacroCalculator from './calculator'


class Popup_MacroCalc extends Component {
    
    render() {
      //return <div>StayFit! Application<p>Fun stuff to come!</p></div>;

        return(
          <div className="Popup_MacroCalc">
            <MacroCalculator />
          </div>
        )
    
    }
  }
  
  export default Popup_MacroCalc;