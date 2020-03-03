import React from "react"
import SelectionPage from '../login/selection'
import axios from 'axios'

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
            back: false,
            userAge: null,
            userGender: null,
            userWeight: null,
            userHeight: null,
            userActivityLevel: null
        }
        this.handleClick = this.handleClick.bind(this)
    }


    handleClick(e){

        let id = e.target.id
        if (id === 'calculate'){
            let calories = 0;
            system.out.println("here");
            if(this.state.userGender === "Female"){
                calories = 10*(this.state.userWeight) + (6.25 * this.state.userHeight) - 5*this.state.userAge - 161;
            }
            else if(this.state.userGender === "Male"){
                calories = 10*(this.state.userWeight) + (6.25 * this.state.userHeight) - 5*this.state.userAge + 5;
            }
            const schema = {
                carbs: calories*0.35,
                prot: calories*0.35,
                fats: calories*0.30
            };

            axios.post('http://localhost:3000/calculator', schema);
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
                    <input id="userGender" type="text" name="gender" value={this.state.userGender}/>
                    <p>Gender (M/F)</p>
                    <input id="userAge" type="number" name="age" value={this.state.userAge}/>
                    <p>Age</p>
                    <input id="userWeight" type="number" name="weight" value={this.state.userWeight}/>
                    <p>Weight (cm)</p>
                    <input id="userHeight" type="number" name="height" value={this.state.userHeight}/>
                    <p>Height (lbs)</p>
                    <input id="userActivityLevel" type="text" name="activity" value={this.state.userActivityLevel}/>
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