import React from "react"
import SelectionPage from '../login/selection'

class Grid extends React.Component{

    constructor(){
        super()
        this.state={
            exercise: null,             //  replace with array of objects -> {exercise: , personalRecord: , muscle: , day: }
            personalRecord: null, 
            muscle: null,
            back: false
        }
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount(){
        //  load relevant data from database
        //  set state accordingly via this.setState({})
    }

    handleClick(e){
    
        let id = e.target.id

        if (id === 'update'){
            //  grab the inputted values
            //  set state with new values

        }
        else{

            //  go back to selection page
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
            <div className = "ExerciseGrid">
                <h1>Exercise Grid</h1>
                <div className="currValues">
                    <h3>Exercise: {this.state.exercise}</h3>
                    <h3>Personal Record: {this.state.personalRecord}</h3>
                    <h3>Muscle: {this.state.muslce}</h3>
                </div>
                    
                <div className="update">
                    <input id="exerciseInput" type="text"></input>
                    <p>Exercise</p>
                    <input id="personalRecord" type="text"></input>
                    <p>Personal Record</p>
                    <input id="muslce" type="text"></input>
                    <p>Muslce</p>
                    <button type="button" id="update" onClick={this.handleClick}>update</button> 
                </div>

                <button type="button" id="back" onClick={this.handleClick}>go back</button> 
            </div>
        )

    }


} 


export default Grid