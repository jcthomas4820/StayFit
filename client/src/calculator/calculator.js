import React from "react"

//  allow user to calculate their recommended daily macros
class MacroCalculator extends React.Component{

    constructor(){
        super()
        this.state={

        }
    }

    handleClick(e){

        //perform click events here

    }



    render(){

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
                </div>
            </div>

        )

    }

} 

export default MacroCalculator