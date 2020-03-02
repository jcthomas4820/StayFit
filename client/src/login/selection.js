import React from "react"
import LoginPage from '../logout/login'
import Grid from '../grid/grid'
import MacroCalculator from '../calculator/calculator'
import NutritionTracker from '../tracker/tracker'


//  allow user to select which component they want to access
class SelectionPage extends React.Component{

    constructor(){
        super()
        this.state={
            loggedIn: true,
            grid: false,
            macro: false,
            nutrition: false
        }

        this.handleLogout = this.handleLogout.bind(this)      //  bindings required for binding handleLogout and handleClick function to use this state
        this.handleClick = this.handleClick.bind(this)           
    }

    handleLogout(){

        //  perform backend logout operations
        
        //  update state
        this.setState({loggedIn: false});
    }

    handleClick(e){
        let id = e.target.id

        if (id === 'grid'){
            this.setState({grid: true})  
        }
        else if (id === 'macro'){
            this.setState({macro: true})  
        }
        else{
            this.setState({nutrition: true})  
        }
    }

    render(){

        //  if user selects to log out, send back to login screen
        if (!(this.state.loggedIn)){
            return(
                <div>
                    <LoginPage />
                </div>
            )
        }
        
        //  if user selects grid component, load component
        else if (this.state.grid){
            return(
                <div>
                    <Grid />
                </div>
            )
        }
        
       //  if user selects macro calculator component, load component
       else if (this.state.macro){
            return(
                <div>
                    <MacroCalculator />
                </div>
            )
        }   
        //  if user selects nutrition tracker component, load component
       else if (this.state.nutrition){
            return(
                <div>
                    <NutritionTracker />
                </div>
            )
        }

        //  display the selection screen, containing buttons to load each component
        return(
            <div className = "SelectionPage">
                <button type="button" id="grid" onClick={this.handleClick}>Exercise Grid</button>
                <button type="button" id="macro" onClick={this.handleClick}>Macro Calculator</button>
                <button type="button" id="nutrition" onClick={this.handleClick}>Nutrition Tracker</button>
                <button type="button" onClick={this.handleLogout}>Logout</button>
            </div>
        )

    }

} 

export default SelectionPage