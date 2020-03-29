import React from "react"
import axios from "axios";
import { Redirect } from 'react-router-dom'
axios.defaults.withCredentials = true

//  allow user to login/register
class LoginPage extends React.Component{

    constructor(){
        super()
        this.state={
            loginError: true,
            errorMessage: null,
            username: "",
            password: ""
        }
        this.handleClick = this.handleClick.bind(this)      //  required for binding handleClick function to use this state
    }
    
    // If a user was already logged in, say there were no login
    // errors and send them directly to the selection page
    componentWillMount(){
        axios.get('http://localhost:3001/api/').then((res) => {
            let status = res.data.status;

            if(status === 'Not logged in') {
                this.setState({loginError: true});
            } else {                
                this.setState({loginError: false});
            }
        });
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

            axios.post('http://localhost:3001/api/login', returningUser).then((res) => {
                let err = res.data.logError;

                if (err) {
                    this.setState({errorMessage: err});
                    this.setState({loginError: true});
                    this.setState({success: false});
                }
                else {
                    this.setState({errorMessage: null});
                    this.setState({loginError: false});
                    this.setState({success: true});
                }
            });
        }
        else if (id === "register"){
            const newUser = {
                username: this.state.username,
                password: this.state.password
            }

            axios.post('http://localhost:3001/api/register', newUser).then((res) => {
                let err = res.data.regError;
                if (err) {
                    this.setState({errorMessage: err});
                    this.setState({loginError: true});
                    this.setState({nextPage: false});
                }
                else {
                    this.setState({errorMessage: null});
                    this.setState({loginError: false});
                    this.setState({nextPage: true});
                }
            });
        }
    }

    render(){

        //  when no errors in logging in/registering, direct user to selection page
        if (!this.state.loginError){
            return(
                <Redirect push to='/selection'/>
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