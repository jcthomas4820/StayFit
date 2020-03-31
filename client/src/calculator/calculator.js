/*
Form written as controlled component:
    MacroCalculator component randers the form and controls what happens in that form
*/

import React from "react"
import axios from 'axios'
axios.defaults.withCredentials = true;
//import { thisExpression } from "@babel/types"

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
            results: "",
            errorMsg: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.clearForm = this.clearForm.bind(this);
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

    //  function used to clear all values on screen
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
            results: "",
            errorMsg: ""
        })
    }

    //  function used to handle calculate and submission
    handleClick(e){

        const button = e.target.name

        if (button === "calculate"){
            // grab the user data
            let gender = this.state.gender;
            let age = this.state.age;
            let weight = this.state.weight;
            let height = this.state.height;
            let activityLevel = this.state.activityLevel;


            //  ensure state has all proper values (no neg, numbers not alpha, all values are entered, etc.)
            //  if errors present, update in state
            //  grab user entered values
           const userData = {
                userGender: gender,
                userAge: age,
                userWeight: weight,
                userHeight: height,
                userActivityLevel: activityLevel
            }

           // send user entered data to the server to calculate the required data
          axios.post('http://localhost:3001/api/calculate', userData).then((res) => {
            // grab data returned by server
            let err = res.data.calcError;
            let macros = res.data.macros;

            if (err) {
                this.setState({errorMsg: err})
            }
            else {
                // update state to reflect values calculated for macros
                this.setState({carbs: macros.carbs})
                this.setState({prot: macros.prot})
                this.setState({fats: macros.fats})
                this.setState({results: this.state.carbs + " g carbs, " + this.state.prot + " g protein, " + this.state.fats + " g fats"})
            }
        });
    }
        else if(button === "submit"){

            //  grab and store this macros into database
            let macros = {prot: this.state.prot, carbs: this.state.carbs, fats: this.state.fats}
                axios.post('http://localhost:3001/api/submit', macros).then((res) => {
                let err = res.data.submitError;
                if(err){
                    this.setState({errorMsg: err})
                }
                else{
                    //  clear all values
                    this.clearForm()
                    //  let user know values were saved
                    this.setState({errorMsg: res.data});
                }
            });

        }
    }


//  note: radio buttons only allow one selection per name attribute
    render(){

        return(
            <div className="MacroCalculator">
                <h1>Macro Calculator</h1>
                <p>{this.state.errorMsg}</p>
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
                        <input name="activityLevel" type="radio" value="moderately active" onChange={this.handleChange} /> Moderately Active
                        <input name="activityLevel" type="radio" value="very active" onChange={this.handleChange} /> Very Active
                        <input name="activityLevel" type="radio" value="extra active" onChange={this.handleChange} /> Extra Active
                    </label>

                    <br/>
                    <div>
                        <input type="button" name="calculate" value="calculate" onClick={this.handleClick} />
                        <input type="button" name="submit" value="submit"  onClick={this.handleClick} />
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