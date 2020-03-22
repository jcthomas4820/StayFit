import React from "react"
import axios from 'axios'

//  allow user to calculate their recommended daily macros
class MacroCalculator extends React.Component{

    constructor(){
        super()
        this.state={
            // data to calculate
            data: {prot: null,
                   carbs: null,
                   fats: null},

            // user input data
            userAge: null,
            userGender: null,
            userWeight: null,
            userHeight: null,
            userActivityLevel: null,

            // calc state
            calcError: false,
            calcSuccess: false,
            calcErrMessage: null,

            // submit state
            submit: false,
            submitErr: false;
            submitErrMessage: null,

            // nextPage state
            nextPage: false
        }
        this.handleClick = this.handleClick.bind(this)
    }


    handleClick(e){

        let id = e.target.id
        if (id === 'calculate'){

           //  grab user entered values
           const userData = {
               userAge: this.state.userAge,
               userGender: this.state.userGender,
               userWeight: this.state.userWeight,
               userHeight: this.state.userHeight,
               userActivityLevel: this.state.userActivityLevel
           }

           //  perform macro calculations using Mifflin-St. Jeor equation (https://www.healthline.com/nutrition/how-to-count-macros#step-by-step)
           // send user entered data to the server to calculate the required data
          axios.post('http://localhost:3001/api/calculator', userData).then((res) => {
             // grab data returned by server
             let err = res.data.calcError;
             let dataCalculated = res.data.dataCalculated;

             if (err) {
                 this.setState({calcError: true});
                 this.setState({calcSuccess: false});
                 this.setState({calcErrMessage: err});
                 console.log("Err: Values not calculated: ");
             }
             else {
                 // update state to reflect values calculated for macros
                 this.setState({data: dataCalculated})
                 // update state for calc
                 this.setState({calcError: false});
                 this.setState({calcSuccess: true});
                 this.setState({calcErrMessage: null});
                 console.log("Values calculated: " + dataCalculated);
             }
         });
        }
        else if (id === 'submit'){
            //  error check: ensure values are calculated before submission, by checking this.state.calcSuccess
            if(this.state.calcSuccess === false){
                //  display err message to user, prompt them to enter data and press calculate first
            }
            else{
                //  grab this.state.data, store this data into database
                 axios.post('http://localhost:3001/api/submit', this.state.data).then((res) => {
                    let err = res.data.submitErr;
                    if(err){
                        // there should not be any err but if in case there is, do this
                        this.setState({submit: false});
                        this.setState({nextPage: false});
                        this.setState({submitError: true});
                        this.setState({submitErrMessage: err});

                         // let user know values were not saved and to try again by pressing Submit
                         console.log("Values not saved");
                    }
                    else{
                        this.setState({submit: true});
                        this.setState({nextPage: true});
                        this.setState({submitError: false});
                        this.setState({submitErrMessage: null});
                        //  clear the values on the screen (clear state values) .
                        this.setState({userAge: null});
                        this.setState({userGender: null});
                        this.setState({userHeight: null});
                        this.setState({userWeight: null});
                        this.setState({userActivityLevel: null});

                        //  let user know values were saved
                        console.log("Values saved");
                    }
                 });
            }

        }
        else if(id === 'nextPage'){
            //  clear the values on the screen (clear state values) .
            this.setState({userAge: null});
            this.setState({userGender: null});
            this.setState({userHeight: null});
            this.setState({userWeight: null});
            this.setState({userActivityLevel: null});

            this.setState({nextPage: true});
        }

    }


    render(){

        //  when no errors in logging in/registering, direct user to selection page
        if (this.state.nextPage){
            return(
                <Redirect push to='/selection'/>
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
                    <input id="userActivityLevel" type="number" name="activity level number" value={this.state.userActivityLevel}/>
                    <p>Activity Level (1-sedentary, 2-lightly active, 3-moderately active, 4-very active, 5-extra active)</p>
                </div>
                <div className="Results">
                    <input id="results" disabled type="text"></input>
                </div>
                <div className="CalcButtons">
                    <button type="button" id="calculate" onClick={this.handleClick}>calculate</button>
                    <button type="button" id="Submit" onClick={this.handleClick}>submit</button>
                    <button type="button" id="Back" onClick={this.handleClick}>back</button>
                </div>
            </div>

        )

    }

} 

export default MacroCalculator