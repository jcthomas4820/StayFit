import React from "react"
import axios from 'axios'
import Navbar from '../layouts/navbar'
import ReactTable from 'react-table'
import {Row, Column} from 'simple-flexbox'
import "react-table/react-table.css";
import {Header1, Body, Input, Button, Error} from '../styles/custom'

axios.defaults.withCredentials = true;

/*
Grid acts as the parent component, and Row acts as the child.
Grid will 
    - load saved data from database for each row, update its own state (see componentWillMount())
Row will
    - display the input information for each exercise 
    - once user saves, it will store this row's content in database (see handleSave())
*/

class Grid extends React.Component{

    constructor(){
        super()
        this.state={
            userMsg: "",
            exercises: []
        }
    }

    componentWillMount(){
        // load each row data from databse for each row, save in state
            // for example:
                //  load list from database, assign state as follows:
                //  let tempList=["bicep curl", "25lb 4s10r", "3/24/20"]   --> this is the values from the database stored as a list
                //  this.setState({ row0List: tempList })      --> save as the appropriate row's list
        axios.get('http://localhost:3001/api/get-grid-data').then((res) => {
            let err = res.data.getGridError;

            if(err){
                this.setState({userMsg: err});
            }
            else{
                let exerciseList = res.data.exerciseData;
                if (exerciseList.length > 0) { this.setState({exercises: exerciseList}); }
            }
        });
    }

    renderTableHeader() {
        return (
            [
                {Header: 'NAME', accessor: 'name',
                    getProps: () => {
                        return {
                            style: { fontFamily: 'sans-serif' },
                        };
                    },
                    headerStyle: { fontFamily: 'sans-serif', fontWeight: 'bold' }
                },
                {Header: 'DATE', accessor: 'date', 
                    getProps: () => {
                        return {
                            style: { fontFamily: 'sans-serif' },
                        };
                    },
                    headerStyle: { fontFamily: 'sans-serif', fontWeight: 'bold' }
                },
                {Header: 'DESCRIPTION', accessor: 'description',
                    getProps: () => {
                        return {
                            style: { fontFamily: 'sans-serif' },
                        };
                    },
                    headerStyle: { fontFamily: 'sans-serif', fontWeight: 'bold' }, 
                    sortable: false
                }
            ]
        )
    }

    render(){
        return(
            <div className = "ExerciseGrid">
                <Column flexGrow={1}>
                    <Navbar />
                    <Row horizontal='center'><Header1>Exercise Grid</Header1></Row>
                    <ExerciseInput />
                    { this.state.exercises.length === 0 
                        ? <Row horizontal='center'><Body>{this.state.userMsg}</Body></Row> 
                        : <ReactTable data={this.state.exercises} columns={this.renderTableHeader()} defaultPageSize={5}/>
                    }
                </Column>
            </div>
        )

    }
}

class ExerciseInput extends React.Component{

    constructor(){
        super()
        this.state={
            name: "",
            description: "",
            date: "",
            errMsg: ""
        }
        this.handleSave = this.handleSave.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e){

        const name = e.target.name
        const value = e.target.value

        switch(name){

            case "name":
                this.setState({name: value})
                break
            case "description":
                this.setState({description: value})
                break
            case "date":
                this.setState({date: value})
                break
            default:
                return    
        }
    }

    handleSave(e){
        let name = this.state.name;
        let description = this.state.description;
        let date = this.state.date;

        //  store this row's (defined by this.state.rowNum) state data: name, progress, and date
        //  if err, this.setState({errMsg: err})
       const data = {
            exerciseName: name,
            exerciseDescription: description,
            exerciseDate: date,
        }

        axios.post('http://localhost:3001/api/save-grid-data', data).then((res) => {
            let err = res.data.saveGridError;
            if(err){
                this.setState({errMsg: err});
            }
            else{
                // Reload the page
                window.location.reload(false);
            }
        });
    }

    render(){
        return(
            <div className="Row">
                <Row horizontal='center'><Error>{this.state.errMsg}</Error></Row>
                <Row horizontal='center'>
                    <Column flexGrow={0} horizontal='center'>
                        <Input id="name" type="text" name="name" placeholder="name" onChange={this.handleChange}></Input>
                    </Column>
                    <Column flexGrow={0} horizontal='center'>
                        <Input id="date" type="text" name="date" placeholder="mm/dd/yyyy" onChange={this.handleChange}></Input>
                    </Column>
                    <Column flexGrow={0} horizontal='center'>
                        <Input id="description" type="text" name="description" placeholder="description" onChange={this.handleChange}></Input>
                    </Column>
                    <Column flexGrow={0} horizontal='center'>
                        <Button id="add" onClick={this.handleSave}>add exercise</Button>
                    </Column>
                </Row>
            </div>
        )
    }
}

export default Grid
