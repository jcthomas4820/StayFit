import React from "react"

class NutritionTracker extends React.Component{

    constructor(){
        super()
        this.state={
            apiValues: {protein: null, carbs: null, fats: null},
            todayValues: {protein: null, carbs: null, fats: null},
        }
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount(){
        //  load relevant data from database
        //  set state accordingly via this.setState({})
    }

    handleClick(e){
    
        let id = e.target.id

        if (id === "analyze"){
            //  grab user input
            //  make api call
            //  set state with apiValues
            //  set text appropriately on screen
        }

        else if (id === "submit"){
            //  store today's values for macros + apiValues in database
            //  update state accordingly
        }

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