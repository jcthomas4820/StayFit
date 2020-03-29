import React from "react"
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
axios.defaults.withCredentials = true


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
    }

    handleLogout(){

        //  perform backend logout operations
        axios.post('http://localhost:3001/api/logout').then((res) => {
            let err = res.data.logoutErr;
            console.log(err);
            if (err === 'There is no one logged in' || !err) { this.setState({loggedIn: false}); }
            else { this.setState({loggedIn: true}); }
        });
    }

    render(){

        //  if user selects to log out, send back to login screen
        if (!(this.state.loggedIn)){
            return(
                <Redirect push to='/logout'/>
            )
        }

        //  display the selection screen, containing buttons to load each component
        // target="_blank" opens a new tab
        return(
            <div className = "SelectionPage">
                <Link to='/grid' target="_blank">
                    <button type="button">
                        Exercise Grid
                    </button>
                </Link>
                <Link to='/calculator' target="_blank">
                    <button type="button">
                        Macro Calculator
                    </button>
                </Link>
                <Link to='/tracker' target="_blank">
                    <button type="button">
                        Nutrition Tracker
                    </button>
                </Link>
                <button type="button" id="logout" onClick={this.handleLogout}>Logout</button>
            </div>
        )

    }

} 

export default SelectionPage