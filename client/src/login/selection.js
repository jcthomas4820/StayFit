import React from "react"

//  allow user to select which component
class SelectionPage extends React.Component{

    constructor(){
        super()
        this.state={

        }
    }

    render(){

        return(
            <div className = "SelectionPage">
                <button type="button">Exercise Grid</button>
                <button type="button">Macro Calculator</button>
                <button type="button">Nutrition Tracker</button>
            </div>
        )

    }

} 

export default SelectionPage