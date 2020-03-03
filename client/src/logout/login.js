import React from "react"
import axios from "axios";
import SelectionPage from '../login/selection'

//  first component that will pop up on application. 
//  allow user to login/register
class LoginPage extends React.Component{

    constructor(){
        super()
        this.state={
            loginError: false,
            errorMessage: null,
            nextPage: false,
            username: "",
            password: ""
        }
        this.handleClick = this.handleClick.bind(this)      //  required for binding handleClick function to use this state
    }
    
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick(e){
        let id = e.target.id
        if (id === "login"){
            const returningUser = {
                username: this.state.username,
                password: this.state.password
            }

            axios.post('/login', returningUser);

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
            axios({
                method: 'post',
                url: '/register',
                data: {
                  username: this.state.username,
                  password: this.state.password,
                }
              });

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
                    <input id="userName" type="text" name="username" value={this.state.username} onChange={e => this.handleChange(e)}></input>
                    <p>username</p> 
                    <input id="password" type="text" name="password" value={this.state.password} onChange={e => this.handleChange(e)}></input>  
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