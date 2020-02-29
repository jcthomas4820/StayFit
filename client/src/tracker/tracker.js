import React from "react"

class NutritionTracker extends React.Component{

    constructor(){
        super()
        this.state={

        }
    }

    handleClick(e){
    
        // make api call, submit results

    }

    render(){

        return(
            <div className = "NutritionTracker">
                <h1>Nutrition Tracker</h1>
                <div className="dailyGoals">
                    <h2>Daily Goals</h2>
                    <h3>Protein: </h3>
                    <h3>Carbs: </h3>
                    <h3>Fats: </h3>
                </div>
                    
                <div className="today">
                    <h2>Today</h2>
                    <h3>Protein: </h3>
                    <h3>Carbs: </h3>
                    <h3>Fats: </h3>
                </div>
                    
                <div className="analysis">
                    <input id="mealInput" type="text"></input>
                    <p>Input Your Meal</p>
                    <button type="button" id="analyze" onClick={this.handleClick}>Analyze Meal</button> 
                    <input id="results" disabled type="text"></input>
                    <button type="button" id="submit" onClick={this.handleClick}>Submit</button> 
                </div>
            </div>
        )

    }


} 


export default NutritionTracker