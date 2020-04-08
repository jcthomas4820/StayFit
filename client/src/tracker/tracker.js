import React from "react"
import axios from 'axios'
axios.defaults.withCredentials = true;


class NutritionTracker extends React.Component{

    constructor(){
        super()
        this.state={
            apiValues: [0, 0, 0],            //  [protein, carbs, fats]
            todayValues: [0, 0, 0],     
            goalValues: [0, 0, 0],
            userInput: "",
            errMsg: ""
        }
        this.handleAnalysis = this.handleAnalysis.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)    
        this.handleChange = this.handleChange.bind(this)     
        //  need to bind componentWillMount????
    }

    componentWillMount(){
        //  load relevant data from database
        //  load list from database, assign state as follows:
            //  let tempList=[x, x, x]   --> this is the values from the database stored as a list
            //  this.setState({ todayValues: tempList })      --> save as the appropriate lists for todayValues and goalValues
        
            //  load api (if long operation)????
    }

    //  function handles text changes in textarea
        //  allows changes to appear on webpage in the textarea
    handleChange(e){
        this.setState({userInput: e.target.value})
    }

    handleAnalysis(){
        
        //  api operations, set apiValues in state
        //  if err, this.setState({errMsg: err})

        let recipeObject = {recipe: this.state.userInput}

        axios.post('http://localhost:3001/api/get-recipe-results', recipeObject).then((res) => {
                
                /*
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
                */

                console.log(res.data.fats)
                console.log(res.data.carbs)
                console.log(res.data.protein)
        });

    }

    handleSubmit(){

        //  update state's todayValues (e.g. todayValues = todayValues+apiValues)
        //  submit state data for todayValues and goalValues in database 
        //  if err, this.setState({errMsg: err})
    }
   

    render(){

        return(
            <div className="NutritionTracker">
                <h1>Nutrition Tracker</h1>
                <p>{this.state.errMsg}</p>
                <div className="DailyGoals">
                    <h3><u>Daily Goals</u></h3>
                    <p>Protein: {(this.state.goalValues)[0]}g</p>
                    <p>Carbs: {(this.state.goalValues)[1]}g</p>
                    <p>Fats: {(this.state.goalValues)[2]}g</p>
                </div>
                <div className="ProgressToday">
                    <h3><u>Progress Today</u></h3>
                    <p>Protein: {(this.state.todayValues)[0]}g</p>
                    <p>Carbs: {(this.state.todayValues)[1]}g</p>
                    <p>Fats: {(this.state.todayValues)[2]}g</p>
                </div>
                <div className="APIBlock">
                    <h3>Input Meal:</h3>
                    <textarea cols="50" rows="10" name="user_meal" value={this.state.userInput} onChange={this.handleChange}></textarea>
                    <button name="analyze" onClick={this.handleAnalysis}>analyze</button>
                    <h3>Analysis:</h3>
                    <textarea cols="30" rows="5" name="api_analysis" disabled></textarea>
                    <button name="submit" onClick={this.handleSubmit}>submit</button>
                </div>
            </div>
        )

    }


} 


export default NutritionTracker