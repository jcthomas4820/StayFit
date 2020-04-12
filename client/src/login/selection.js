import React from "react"
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

import LogoImg from '../homepage.png'
import Navbar from '../layouts/navbar'
import {Row, Column} from 'simple-flexbox'
import {Header1, Header2, Body} from '../styles/custom'

axios.defaults.withCredentials = true


//  allow user to select which component they want to access
class HomePage extends React.Component{

    constructor(){
        super()
        this.state={
            loggedIn: true,
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
            <div className = "HomePage">
                <Navbar />
                <Column flexGrow={1}>
                    <Row horizontal='center'><Header1>Welcome to StayFit!</Header1></Row>
                    <Row horizontal='center'>
                        <img src={LogoImg} alt="Website logo" />
                    </Row>
                    <Row vertical='center'>
                        <Column flexGrow={1} horizontal='center'>
                            <Header2> Exercise Grid </Header2>
                            <Body> Use the exercise grid to keep track of your daily workouts! </Body>
                            <Body> Just enter the name of the exercise, what you did, and when you did it.</Body>
                            <Body> StayFit! will take care of the rest! Choose to organize your grid by</Body>
                            <Body> the name of your exercise, or the date you did it on. </Body>
                        </Column>
                        <Column flexGrow={1} horizontal='center'>
                            <Header2> Meal Planner </Header2>
                            <Body> Use the meal planner to generate a meal plan for your day! </Body>
                            <Body> Start by calculating your required calorie intake for </Body>
                            <Body> each day. Then, we will generate a custom meal plan for you. </Body>
                            <Body> You will then be able to view your meal plan and its nutrition info! </Body>
                        </Column>
                    </Row>
                </Column>
            </div>
        )

    }

} 

export default HomePage