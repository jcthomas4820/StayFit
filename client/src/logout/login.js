import React from "react"
import SelectionPage from '../login/selection'

//  first component that will pop up on application. 
//  allow user to login/register
class LoginPage extends React.Component{

    constructor(){
        super()
        this.state={
            loginError: false,
            errorMessage: null,
            nextPage: false
        }
        this.handleClick = this.handleClick.bind(this)      //  required for binding handleClick function to use this state
    }

    handleClick(e){
    
        let id = e.target.id
        
        if (id === "login"){
            //  perform login operations
            //  if there is an error while logging in, update state
                //  this.setState({loginError: true})
                //  this.setState({errorMessage: "Incorrect user/pass"})
                //  this.setState({nextPage: false})
            // else, update state
                //  this.setState({loginError: false})
                //  this.setState({errorMessage: null})
                //  this.setState({nextPage: true})         //  render function will automatically navigate user to selection page
        }
        else if (id === "register"){
            //  perform register operations
            //  if there is an error while registering, update state
                //  this.setState({loginError: true})
                //  this.setState({errorMessage: "some error message here"})
                //  this.setState({nextPage: false})
            // else, update state
                //  this.setState({loginError: false})
                //  this.setState({errorMessage: null})
                //  this.setState({nextPage: true})         //  render function will automatically navigate user to selection page
        }
         
        //  remove this once backend is added successfully
        this.setState({nextPage: true})

    }

    render(){

        //  when no errors in logging in/registering, direct user to selection page
        if (this.state.nextPage){
            return(
                <div>
                    <SelectionPage />
                </div>
            )
        }

        //  login page, displays errors if present
        return(
            <div className = "LoginPage">
                <h1>Welcome to StayFit!</h1>
                <div className = "login/register section">
                    <p>{this.state.errorMessage}</p>
                    <input id="userName" type="text"></input>
                    <p>username</p> 
                    <input id="password" type="text"></input>  
                    <p>password</p> 
                </div>
                <div className = "login/register buttons">
                    <button type="button" id="login" onClick={this.handleClick}>login</button>
                    <button type="button" id="register" onClick={this.handleClick}>register</button>
                </div>
            </div>
        )

    }


} 


export default LoginPage