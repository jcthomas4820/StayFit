import React from "react"

/*
Grid acts as the parent component, and Row acts as the child.
Grid will 
    - load saved data from database for each row, update its own state (see componentWillMount())
    - render 3 new child Row components
Row will
    - display ui of each row
    - allow user to edit its rows
    - once user saves, it will store this row's content in database (see handleSave())
*/

class Grid extends React.Component{

    constructor(){
        super()
        this.state={
            row0List: ["", "", ""],         // [exercise, progress, date] 
            row1List: ["", "", ""],
            row2List: ["", "", ""]
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
            let exercise1 = res.data.exercise1;
            let exercise2 = res.data.exercise2;
            let exercise3 = res.data.exercise3;
            if(err){
                console.log(err);
            }
            else{
                this.setState({ row0List: exercise1,
                                row1List: exercise2,
                                row2List: exercise3 });
            }
    });
    }

    render(){

        return(
            
            <div className = "ExerciseGrid">
                <h1>Exercise Grid</h1>
                < Row rowList={this.state.row0List} rowNum={0} />
                < Row rowList={this.state.row1List} rowNum={1} />
                < Row rowList={this.state.row2List} rowNum={2} />
            </div>
            
        )

    }
}

class Row extends React.Component{

    constructor(){
        super()
        this.state={
            name: "",
            progress: "",
            date: "",
            rowNum: null,
            status: "disabled",
            errMsg: ""
        }
        this.handleEdit = this.handleEdit.bind(this)
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
            case "progress":
                this.setState({progress: value})
                break
            case "date":
                this.setState({date: value})
                break
            default:
                return    
        }


    }

    handleEdit(e){

        //  change all inputs to be enabled
        this.setState({status: ""})
        this.setState({editPressed: true})
    }

    handleSave(e){
        let name = this.state.name;
        let progress = this.state.progress;
        let date = this.state.date;
        let rowNum = this.state.rowNum;

        if(name === ""){
            this.setState({errMsg: 'You must provide a name for the exercise'});
        }
        else if( progress === ""){
            this.setState({errMsg: 'You must provide the progress of the exercise'})
        }
        else if(date === ""){
            this.setState({errMsg: 'You must provide a date'})
        }
        else if (!rowNum){
            console.log("Row number not updated")
        }
        else{
            //  store this row's (defined by this.state.rowNum) state data: name, progress, and date
            //  if err, this.setState({errMsg: err})
           const data = {
                exerciseName: name,
                exerciseProgress: progress,
                exerciseDate: date
            }
            axios.post('http://localhost:3001/api/save-grid-data', data).then((res) => {
                        let err = res.data.saveGridError;
                        if(err){
                              this.setState({errMsg: err});
                        }
                        else{
                            this.setState({errMsg: res.data})
                        }
                });

        }
    }

    componentWillReceiveProps(props){
        this.setState({name: (props.rowList)[0]})
        this.setState({progress: (props.rowList)[1]})
        this.setState({date: (props.rowList)[2]})
        this.setState({rowNum: (props.rowNum)})
    }

    render(){
        return(
            <div className="Row">
                <p>{this.state.errMsg}</p>
                <div>
                    Name <br/> <input name="name" onChange={this.handleChange} value={this.state.name} disabled={this.state.status}/> 
                    <button onClick={this.handleEdit}>edit</button>
                    <button onClick={this.handleSave}>save</button>
                </div>
                <div>
                    Progress <br/> <input name="progress" onChange={this.handleChange} value={this.state.progress} disabled={this.state.status} /> 
                    <button onClick={this.handleEdit}>edit</button>
                    <button onClick={this.handleSave}>save</button>
                </div>
                <div>
                    Date <br/> <input name="date" onChange={this.handleChange} value={this.state.date} disabled={this.state.status} /> 
                    <button onClick={this.handleEdit}>edit</button>
                    <button onClick={this.handleSave}>save</button>
                </div>
            </div>
        )
    }
}

export default Grid