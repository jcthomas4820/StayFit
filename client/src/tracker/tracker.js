import React from "react"

class NutritionTracker extends React.Component{

    constructor(){
        super()
        this.state={
            apiValues: {protein: null, carbs: null, fats: null},
            todayValues: {protein: 0, carbs: 0, fats: 0},
            goalValues: {protein: 0, carbs: 0, fats: 0},
            userInput: ""
        }
        this.handleAnalysis = this.handleAnalysis.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)    
        this.handleChange = this.handleChange.bind(this)     
        //  need to bind componentDidMount????
    }

    componentDidMount(){
        //  load relevant data from database
        //  set state accordingly via this.setState({})
        //  load api????
    }

    handleChange(e){
        this.setState({userInput: e.target.value})
    }

    handleAnalysis(){
        
        //  api operations

    }

    //  function handles text changes in textarea
        //  allows changes to appear on webpage in the textarea
    handleSubmit(){

        //  submit values to database
        //  update state's todayValues
    }
   

    render(){

        return(
            <div className="NutritionTracker">
                <h1>Nutrition Tracker</h1>
                <div className="DailyGoals">
                    <h3><u>Daily Goals</u></h3>
                    <p>Protein: {this.state.goalValues.protein}g</p>
                    <p>Carbs: {this.state.goalValues.carbs}g</p>
                    <p>Fats: {this.state.goalValues.fats}g</p>
                </div>
                <div className="ProgressToday">
                    <h3><u>Progress Today</u></h3>
                    <p>Protein: {this.state.todayValues.protein}g</p>
                    <p>Carbs: {this.state.todayValues.carbs}g</p>
                    <p>Fats: {this.state.todayValues.fats}g</p>
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