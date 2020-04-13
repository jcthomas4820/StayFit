/*
Form written as controlled component:
    MacroCalculator component randers the form and controls what happens in that form
*/

import React from "react"
import axios from 'axios'
import Navbar from '../layouts/navbar'
import { Redirect, Link } from 'react-router-dom'

import { Header1, Header2, Button, Input, Body, Error } from "../styles/custom";
import {Row, Column} from 'simple-flexbox'

axios.defaults.withCredentials = true;

//  allow user to calculate their recommended daily macros
class MealPlanner extends React.Component{

    constructor(){
        super()
        this.state={
            gender: "",
            age: "",
            weight: "",
            height: "",
            activityLevel: "",
            cals: null,
            errorMsg: "",
            calMsg: "",              // "Your daily calorie intake should be: <cals here>"
            generate: false,         // generate the meal plan
            planWasGenerated: false,
            view: false              // view the meal plan
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
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

    //  function used to handle calculate calories
    handleClick(e){
        let id = e.target.id
        console.log(id);

        if (id === "calculate"){
            // grab the user data
            let gender = this.state.gender;
            let age = this.state.age;
            let weight = this.state.weight;
            let height = this.state.height;
            let activityLevel = this.state.activityLevel;
            
           const userData = {
                userGender: gender,
                userAge: age,
                userWeight: weight,
                userHeight: height,
                userActivityLevel: activityLevel
            }

            // send user entered data to the server to calculate the required data
            axios.post('http://localhost:3001/api/save-cal-rec', userData).then((res) => {
                // grab data returned by server

                let err = res.data.errMsg
                
                if (err) {
                    this.setState({cals: ""});
                    this.setState({calMsg: ""})
                    this.setState({errorMsg: err});
                }
                else {
                    // update state to reflect values calculated for calories
                    this.setState({cals: res.data.cals});
                    this.setState({calMsg: "Your daily calorie intake should be: " + this.state.cals})
                    this.setState({errorMsg: ""})
                }
                
            }); 
        }
        else if (id === "generate") {
            this.setState({generate: true});
        }
        else if (id === "view") {
            this.setState({view: true});
        }
    }


//  note: radio buttons only allow one selection per name attribute
    render(){

        if (this.state.generate === true) {
            return(
                <Redirect push to='/planner-generate'/>
            )
        }

        if (this.state.view === true) {
            return(
                <Redirect push to='/planner-view'/>
            )
        }

        return (
            <div className = "MealPlanner" >
                <Navbar />
                <Row horizontal='center'><Header1>Meal Planner</Header1></Row>
                { this.state.calMsg === "" 
                    ? <Row horizontal='center'><Header2>Calculate your calories to use the Meal Planner!</Header2></Row>
                    : <Row horizontal='center'><Header2>{this.state.calMsg}</Header2></Row> }
                <Row horizontal='center'><Error>{this.state.errorMsg}</Error></Row>
                <br/>
                <Row horizontal='center'>
                    <Row flexGrow={0} horizontal='center'><Body>Gender:</Body></Row>
                    <Row flexGrow={0} horizontal='center'>
                        <input name="gender" type="radio" value="male" onChange={this.handleChange}/><Body>Male</Body>
                    </Row>
                    <Row flexGrow={0} horizontal='center'>
                        <input name="gender" type="radio" value="female" onChange={this.handleChange} /><Body>Female</Body>
                    </Row>                    
                </Row>
                <br/>
                <Row horizontal='center'>
                    <Input id="age" type="text" name="age" placeholder="age" onChange={this.handleChange}></Input>
                    <Input id="weight" type="text" name="weight" placeholder="weight (lb)" onChange={this.handleChange}></Input>
                    <Input id="height" type="text" name="height" placeholder="height (in)" onChange={this.handleChange}></Input>              
                </Row>
                <br/>
                <Row horizontal='center'><Body>Activity Level:</Body></Row>
                <Row horizontal='center'><input name="activityLevel" type="radio" value="sedentary" onChange={this.handleChange} /> <Body>Sedentary: Little to no exercise</Body></Row>
                <Row horizontal='center'><input name="activityLevel" type="radio" value="lightly active" onChange={this.handleChange} /> <Body>Lightly Active: Exercise for at least 20 minutes 1 to 3 times per week</Body></Row>
                <Row horizontal='center'><input name="activityLevel" type="radio" value="moderately active" onChange={this.handleChange} /> <Body>Moderately Active: Intensive exercise for at least 30 to 60 minutes 3 to 4 times per week</Body></Row>
                <Row horizontal='center'><input name="activityLevel" type="radio" value="very active" onChange={this.handleChange} /> <Body>Very Active: Intensive exercise for 60 minutes or greater 5 to 7 days per week</Body></Row>
                <Row horizontal='center'><input name="activityLevel" type="radio" value="extra active" onChange={this.handleChange} /> <Body>Extra Active: Exceedingly active and/or very demanding activities</Body></Row>
                <br/>
                <Row horizontal='center'>
                    <Button id="calculate" onClick={this.handleClick}>calculate calories</Button>
                    <Button id="generate" onClick={this.handleClick}>generate meal plan</Button>
                    <Button id="view" onClick={this.handleClick} >view meal plan</Button>
                </Row>
            </div>
        )
    }
} 

export default MealPlanner