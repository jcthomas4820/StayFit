/*
Form written as controlled component:
    MacroCalculator component randers the form and controls what happens in that form
*/

import React from "react"
import axios from 'axios'
import { thisExpression } from "@babel/types"

//  allow user to calculate their recommended daily macros
class MacroCalculator extends React.Component{

    constructor(){
        super()
        this.state={
            gender: "",
            age: "",
            weight: "",
            height: "",
            activityLevel: "",
            carbs: null,
            prot: null, 
            fats: null, 
            results: ""
        }
       
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.clearForm = this.clearForm.bind(this)
    }

    //  function handles text changes in textbox on form
        //  allows any form changes to appear in the form
    handleChange(e){

        const name = e.target.name              //  name of html element changed
        const value = e.target.value            //  value of html element changed

        switch(name){

            case "gender":
                this.setState({gender: value})
                break
            case "age":
                this.setState({age: value})
                break
            case "weight":
                this.setState({weight: value})
                break
            case "height":
                this.setState({height: value})
                break
            case "activityLevel":
                this.setState({activityLevel: value})
                break
            default:
                return

        }

    }

    //  function used to clear all values in the form except results
    clearForm(){
        document.getElementById("macro-calculator").reset()         //  reset radio buttons
        this.setState({                 //  reset state
            gender: "",
            age: "",
            weight: "",
            height: "",
            activityLevel: "",
            carbs: null,
            prot: null, 
            fats: null, 
            results: ""
        })
    }

    //  function used to handle calculate and submission
    handleClick(e){

        //  ensure state has all proper values (no neg, numbers not alpha, all values are entered, etc.)
        //  if errors present, report in results field and return

        const button = e.target.name

        if (button === "calculate"){

            /*
            //  perform macro results calculation using Mifflin-St. Jeor equation (https://www.healthline.com/nutrition/how-to-count-macros#step-by-step)
            const genderFactor = this.state.gender === "male" ? 5 : -161
            let activityFactor=0
            switch(this.state.activityLevel){
                case "sedentary":
                    activityFactor = 1.2
                    break
                case "lightly active":
                    activityFactor = 1.375
                    break
                case "moderatively active":
                    activityFactor = 1.55
                    break
                case "very active":
                    activityFactor = 1.725
                    break
                case "extra active":
                    activityFactor = 1.9
                    break
                default:
                    return
            }

            let calories = activityFactor*((10*this.state.weight)+(6.25*this.state.height)-(5*this.state.age)+genderFactor)
            const carbs = Math.floor((0.5*calories)/4)
            const fats = Math.floor((0.25*calories)/9)
            const protein = Math.floor((0.25*calories)/4)

            //  save in state results
            this.setState({carbsG:carbs, fatsG:fats, protG:protein})
            this.setState({results: carbs+" g carbs, " + fats+" g fats, " + protein+" g protein"})
            */

            //  grab user entered values
           const userData = {
                userAge: this.state.age,
                userGender: this.state.gender,
                userWeight: this.state.weight,
                userHeight: this.state.height,
                userActivityLevel: this.state.activityLevel
            }
        
            //  perform macro calculations using Mifflin-St. Jeor equation (https://www.healthline.com/nutrition/how-to-count-macros#step-by-step)
           // send user entered data to the server to calculate the required data
          axios.post('http://localhost:3001/api/calculator', userData).then((res) => {
            // grab data returned by server
            let err = res.data.calcError;
            let dataCalculated = res.data.dataCalculated;

            if (err) {
                //this.setState({calcError: true});
                //this.setState({calcSuccess: false});
                //this.setState({calcErrMessage: err});
                //console.log("Err: Values not calculated: ");
                this.setState({results: "Error during calculation"})
            }
            else {
                // update state to reflect values calculated for macros
                //this.setState({data: dataCalculated})
                this.setState({carbs: dataCalculated.carbs})
                this.setState({prot: dataCalculated.prot})
                this.setState({fats: dataCalculated.fats})
                /*
                // update state for calc
                this.setState({calcError: false});
                this.setState({calcSuccess: true});
                this.setState({calcErrMessage: null});
                this.setState({results: dataCalculated});
                */
               this.setState({results: this.state.carbs + "g carbs, " + this.state.prot + "g protein, " + this.state.fats + "g fats"})
            }
        });
        
        }

        else if(button === "submit"){

            //  error check: ensure values are calculated before submission, see if results contain "carbs"
            if(!(this.state.results.includes("carbs"))){
                //  display err message to user, prompt them to enter data and press calculate first
                this.setState({results: 'You must calculate macros before submitting'});
            }
            else{
                //  grab this.state.data, store this data into database
                let data = {prot: this.state.prot, carbs: this.state.carbs, fats: this.state.fats}
                 axios.post('http://localhost:3001/api/submit', data).then((res) => {
                    let err = res.data.submitError;
                    if(err){
                        /*
                        // there should not be any err but if in case there is, do this
                        this.setState({submit: false});
                        this.setState({submitError: true});
                        this.setState({submitErrMessage: err});
                         // let user know values were not saved and to try again by pressing Submit
                         this.setState({results: submitErrMessage});
                         */
                        this.setState({results: err})
                    }
                    else{
                        /*
                        this.setState({submit: true});
                        this.setState({submitError: false});
                        this.setState({submitErrMessage: null});
                        //  clear the values on the screen (clear state values) .
                        this.setState({userAge: null});
                        this.setState({userGender: null});
                        this.setState({userHeight: null});
                        this.setState({userWeight: null});
                        this.setState({userActivityLevel: null});
                        */

                        //  clear all values
                        this.clearForm()
                        //  let user know values were saved
                        this.setState({results: 'Your macro values are saved.'});
                    }
                 });
            }
        }


    }


//  note: radio buttons only allow one selection per name attribute
    render(){

        return(
            <div className="MacroCalculator">
                <h1>Macro Calculator</h1>
                
                <form id="macro-calculator" >
                    
                    <label>
                        Gender:<br/>
                        <input name="gender" type="radio" value="male" onChange={this.handleChange} /> Male
                        <input name="gender" type="radio" value="female" onChange={this.handleChange} /> Female
                    </label>
                    <br/>
                    <label>
                        Age (yr):<br/>
                        <input name="age" type="number" value={this.state.age} onChange={this.handleChange} />
                    </label>
                    <br/>
                    <label>
                        Weight (kg):<br/>
                        <input name="weight" type="number" value={this.state.weight} onChange={this.handleChange} />
                    </label>
                    <br/>
                    <label>
                        Height (cm):<br/>
                        <input name="height" type="number" value={this.state.height} onChange={this.handleChange} />
                    </label>
                    <br/>
                    <label>
                        Activity Level:<br/>
                        <input name="activityLevel" type="radio" value="sedentary" onChange={this.handleChange} /> Sedentary
                        <input name="activityLevel" type="radio" value="lightly active" onChange={this.handleChange} /> Lightly Active
                        <input name="activityLevel" type="radio" value="moderatively active" onChange={this.handleChange} /> Moderatively Active
                        <input name="activityLevel" type="radio" value="very active" onChange={this.handleChange} /> Very Active
                        <input name="activityLevel" type="radio" value="extra active" onChange={this.handleChange} /> Extra Active
                    </label>

                    <br/>
                    <div onClick={this.handleClick}>
                        <input type="button" name="calculate" value="calculate" />
                        <input type="button" name="submit" value="submit" />
                    </div>
                    
                    <br/>
                    <label>
                        Results:
                        <textarea value={this.state.results} disabled cols="30" rows="5" />
                    </label>
                </form>
            </div>    

        )

    }

} 

export default MacroCalculator