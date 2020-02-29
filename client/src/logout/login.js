import React from "react"
import SelectionPage from '../login/selection'

//  first component that will pop up on application. 
//  allow user to login/register
class LoginPage extends React.Component{

    constructor(){
        super()
        this.state={

        }
    }

    handleClick(e){
    
        let id = e.target.id

        console.log(id)
        
        if (id === "login"){
            //  perform login operations
        }
        else if (id === "register"){
            //  perform register operations
        }

        //  open login/selection.js
        

    }

    render(){

        return(
            <div className = "LoginPage">
                <h1>Welcome to StayFit!</h1>
                <div className = "login/register section">
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