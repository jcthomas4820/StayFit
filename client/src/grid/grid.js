import React from "react"

class Grid extends React.Component{

    constructor(){
        super()
        this.state={
            row0List: ["", "", ""],
            row1List: ["", "", ""],
            row2List: ["", "", ""]
        }

    }

    componentWillMount(){

        //  load each row data from databse for each row, save in state
            // for example:
                //  load list from database, assign to tempList
                //  let tempList=["bicep curl", "25lb 4s10r", "3/24/20"]
                //  this.setState({ row0List: tempList })
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
            status: "disabled"
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
    }

    handleSave(e){
        //  store this row's (defined by this.state.rowNum) name, progress, and date in database
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