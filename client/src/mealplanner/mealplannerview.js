/*
Form written as controlled component:
    MacroCalculator component randers the form and controls what happens in that form
*/

import React from "react"
import axios from 'axios'
import Navbar from '../layouts/navbar'
import { Header1, Header2, Body, Error } from "../styles/custom";
import {Row, Column} from 'simple-flexbox'

axios.defaults.withCredentials = true;

//  allow user to calculate their recommended daily macros
class MealPlannerGenerate extends React.Component{

    constructor(){
        super()
        this.state={
            mealErr: "",
            breakfast: {},
            lunch: {},
            dinner: {},
            nutrition: {}
        }
    }

    componentWillMount() {
        // Load the meal information for the user
            // for example:
                //  load list from database, assign state as follows:
                // response: { breakfast: {name: "Name", readyIn: " x Minutes", servings: 4}, 
                //             lunch: {name: "Name", readyIn: " x Minutes", servings: 4}, 
                //             dinner: {name: "Name", readyIn: " x Minutes", servings: 4}, 
                //             nutritionInfo: {calories: "cals", carbs: "carbs", protein: "protein", fat: "fat"} }
                //  let breakfast = res.data.breakfast
                //  let lunch = res.data.lunch
                //  let dinner = res.data.dinner
                //  let nutrition = res.data.nutritionInfo
        // set the states of all of this info 

        /*axios.get(URL TO GET THE MEAL INFORMATION).then((res) => {
            let err = res.data.getMealError;

            if(err){
                // Something like: "You haven't generated your meal plan yet!"
                this.setState({mealErr: err});
            }
            else{
                let data = res.data;
                // Breakfast
                const bfast = {name: res.data.breakfast.name, readyIn: res.data.breakfast.readyIn, servings: res.data.breakfast.servings};
                this.setState({breakfast: bfast});
                
                // Lunch 
                // Dinner
                // Nutrients 
            }
        });*/
    }

//  note: radio buttons only allow one selection per name attribute
    render(){
        return (
            <div className = "MealPlannerView" >
                <Navbar />
                <Column flexGrow={1}>
                    <Row horizontal='center'><Header1>View Meal Plan</Header1></Row>
                    <Row horizontal='center'><Error>{this.state.mealErr}</Error></Row>
                    <Row horizontal='center'>
                        <Column flexGrow={1} horizontal='center'>
                            <Header2>Breakfast</Header2>
                            <Body>Name: {this.state.breakfast.name}</Body>
                            <Body>Ready in: {this.state.breakfast.readyIn}</Body>
                            <Body>Servings: {this.state.breakfast.servings}</Body>
                        </Column>

                        <Column flexGrow={1} horizontal='center'>
                            <Header2>Lunch</Header2>
                            <Body>Name: {this.state.lunch.name}</Body>
                            <Body>Ready in: {this.state.lunch.readyIn}</Body>
                            <Body>Servings: {this.state.lunch.servings}</Body>
                        </Column>

                        <Column flexGrow={1} horizontal='center'>
                            <Header2>Dinner</Header2>
                            <Body>Name: {this.state.breakfast.dinner}</Body>
                            <Body>Ready in: {this.state.breakfast.dinner}</Body>
                            <Body>Servings: {this.state.breakfast.dinner}</Body>
                        </Column>
                    </Row>
                    <br/>
                    <br/>
                    <Row horizontal='center'>
                        <Column flexGrow={1} horizontal='center'>
                            <Header2>Nutrients</Header2>
                            <Body>Calories: {this.state.nutrition.calories}</Body>
                            <Body>Carbs: {this.state.nutrition.carbs}</Body>
                            <Body>Fat: {this.state.nutrition.fat}</Body>
                            <Body>Protein: {this.state.nutrition.protein}</Body>
                        </Column>
                    </Row>
                </Column>
            </div>
        )
    }
}



export default MealPlannerGenerate