import React from "react"
import SelectionPage from '../login/selection'

//  allow user to calculate their recommended daily macros
class MacroCalculator extends React.Component{

    constructor(){
        super()
        this.state={
            data: {prot: null,
                    carbs: null,
                    fats: null},
            calc: false,
            submit: false,
            back: false
        }
        this.handleClick = this.handleClick.bind(this)
    }


    handleClick(e){

        let id = e.target.id

        if (id === 'calculate'){
            //  grab user entered values
            //  perform macro calculations using Mifflin-St. Jeor equation (https://www.healthline.com/nutrition/how-to-count-macros#step-by-step)
            //  update state to reflect values calculated for macros  
            //  update state for calc
            this.setState({calc: true})
        }
        else if (id === 'submit'){
            //  error check: ensure values are calculated before submission, by checking this.state.calc
            //  grab this.state.data, store this data into database
            //  let user know values were saved
            //  clear the values on the screen (clear state values)
        }
        else{
            //  user has chosen to go back to selection page
            this.setState({back: true})
        }

    }


    render(){

        //  if user selects to go back, render SelecitonPage
        if (this.state.back){
            return(
                <div>
                    <SelectionPage />
                </div>
            )
        }

        return(
            <div className = "MacroCalculator">
                <h1>Macro Calculator</h1>
                <div className = "UserValues">
                    <input id="userGender" type="text"></input>
                    <p>Gender</p>
                    <input id="userAge" type="text"></input>
                    <p>Age</p>
                    <input id="userWeight" type="text"></input>
                    <p>Weight</p>
                    <input id="userHeight" type="text"></input>
                    <p>Height</p>
                    <input id="userActivityLevel" type="text"></input>
                    <p>Activity Level (sedentary, lightly active, moderatively active, very active, extra active)</p>
                </div>
                <div className="Results">
                    <input id="results" disabled type="text"></input>
                </div>
                <div className="CalcButtons">
                    <button type="button" id="calculate" onClick={this.handleClick}>calculate</button>
                    <button type="button" id="submit" onClick={this.handleClick}>submit</button>
                    <button type="button" id="back" onClick={this.handleClick}>go back</button>
                </div>
            </div>

        )

    }

} 

export default MacroCalculator