import React from "react";
import axios from "axios";
import Navbar from "../portions/navbar";
import ReactTable from "react-table";
import { Row, Column } from "simple-flexbox";
import "react-table/react-table.css";
import {
  Header1,
  Header2,
  Body,
  Input,
  Button,
  Error,
  CustomModal,
} from "../styles/custom";

axios.defaults.withCredentials = true;
/*
Grid acts as the parent component, and Row acts as the child.
Grid will 
    - load saved data from database for each row, update its own state (see componentWillMount())
    - allow users to edit and delete exercises 
Row will
    - display the input information for each exercise 
    - once user saves, it will store this row's content in database (see handleSave())
*/

class Grid extends React.Component {
  constructor() {
    super();
    this.state = {
      userMsg: "",
      editErr: "",
      exercises: [],
      ids: [],
      modalVisible: false,
      indexOfClickedRow: null,
      willEdit: false,

      newName: null,
      newDesc: null,
      newDate: null,
    };
    this.closeModal = this.closeModal.bind(this);
    this.handleEditDelete = this.handleEditDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    // load each row data from databse for each row, save in state
    axios.get("http://localhost:3001/grid/get-grid-data").then((res) => {
      let err = res.data.getGridError;

      if (err) {
        this.setState({ userMsg: err });
      } else {
        console.log(res.data);
        let exerciseList = res.data.exerciseData;
        let idList = res.data.exerciseIds;
        if (exerciseList.length > 0) {
          this.setState({ exercises: exerciseList });
          this.setState({ ids: idList });
        }
      }
    });
  }

  componentDidMount() {
    CustomModal.setAppElement("body");
  }

  // on click listener for each row in the table
  onRowClick = (state, rowInfo, column, instance) => {
    return {
      onClick: (e) => {
        let index = parseInt(rowInfo.index);
        this.setState({ indexOfClickedRow: index });
        this.setState({ modalVisible: true });
      },
    };
  };

  closeModal() {
    this.setState({ modalVisible: false });
    this.setState({ willEdit: false });
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "name":
        this.setState({ newName: value });
        break;
      case "description":
        this.setState({ newDesc: value });
        break;
      case "date":
        this.setState({ newDate: value });
        break;
      default:
        return;
    }
  }

  handleEditDelete(e) {
    let buttonId = e.target.id;
    let i = this.state.indexOfClickedRow;

    if (buttonId === "edit") {
      // set a flag to display the popup menu with edit information
      this.setState({ willEdit: true });
    } else if (buttonId === "delete") {
      // Get the _id of the exercise that we are going to delete from the database
      let exercise = { entryToDelete: this.state.ids[i] };
      axios
        .post("http://localhost:3001/grid/delete-grid-row", exercise)
        .then((res) => {
          let err = res.data.errMsg;

          if (err) {
            // display an error and close the popup
            this.setState({ userMsg: err });
            this.setState({ modalVisible: true });
          } else {
            // close modal and refresh the page
            this.setState({ modalVisible: false });
            window.location.reload(false);
          }
        });
    } else if (buttonId === "editSave") {
      // If nothing was entered in the boxes, just use the previously stored information
      let nameEdit =
        this.state.newName === null
          ? this.state.exercises[i].name
          : this.state.newName;
      let descEdit =
        this.state.newDesc === null
          ? this.state.exercises[i].description
          : this.state.newDesc;
      let dateEdit =
        this.state.newDate === null
          ? this.state.exercises[i].date
          : this.state.newDate;

      let updateData = {
        entryToDelete: this.state.ids[i], // the id of the entry that we want to update
        name: nameEdit, // the information we will update
        date: dateEdit,
        desc: descEdit,
      };

      axios
        .post("http://localhost:3001/grid/edit-grid-row", updateData)
        .then((res) => {
          let err = res.data.editErr;

          if (err) {
            // display an error and close the popup
            this.setState({ editErr: err });
            this.setState({ modalVisible: true });
          } else {
            // close modal and refresh the page
            this.setState({ modalVisible: false });
            this.setState({ willEdit: false });
            window.location.reload(false);

            // make all of the update entries be null again
            this.setState({ newName: null });
            this.setState({ newDesc: null });
            this.setState({ newDate: null });
          }
        });
    }
  }

  renderTableHeader() {
    return [
      {
        Header: "NAME",
        accessor: "name",
        getProps: () => {
          return {
            style: { fontFamily: "sans-serif" },
          };
        },
        headerStyle: { fontFamily: "sans-serif", fontWeight: "bold" },
      },
      {
        Header: "DATE",
        accessor: "date",
        getProps: () => {
          return {
            style: { fontFamily: "sans-serif" },
          };
        },
        headerStyle: { fontFamily: "sans-serif", fontWeight: "bold" },
      },
      {
        Header: "DESCRIPTION",
        accessor: "description",
        getProps: () => {
          return {
            style: { fontFamily: "sans-serif" },
          };
        },
        headerStyle: { fontFamily: "sans-serif", fontWeight: "bold" },
        sortable: false,
      },
    ];
  }

  render() {
    return (
      <div className="ExerciseGrid">
        <Column flexGrow={1}>
          <Navbar id="navigationBar" />
          <Row horizontal="center">
            <Header1>Exercise Grid</Header1>
          </Row>
          <ExerciseInput />
          {this.state.exercises.length === 0 ? (
            <Row horizontal="center">
              <Body>{this.state.userMsg}</Body>
            </Row>
          ) : (
            <ReactTable
              data={this.state.exercises}
              columns={this.renderTableHeader()}
              getTdProps={this.onRowClick}
              defaultPageSize={5}
            />
          )}

          {this.state.willEdit === false ? (
            <CustomModal id="editdelete" isOpen={this.state.modalVisible}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Header2>
                  Would you like to edit or delete this exercise?
                </Header2>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button id="edit" onClick={this.handleEditDelete}>
                  edit
                </Button>
                <Button id="delete" onClick={this.handleEditDelete}>
                  delete
                </Button>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button id="cancel" onClick={this.closeModal}>
                  cancel
                </Button>
              </div>
            </CustomModal>
          ) : (
            <CustomModal id="editentry" isOpen={this.state.modalVisible}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Header2>Edit Exercise</Header2>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Error>{this.state.editErr}</Error>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="name"
                  onChange={this.handleChange}
                />
                <Input
                  id="date"
                  type="text"
                  name="date"
                  placeholder="mm/dd/yyyy"
                  onChange={this.handleChange}
                />
                <Input
                  id="description"
                  type="text"
                  name="description"
                  placeholder="description"
                  onChange={this.handleChange}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button id="editSave" onClick={this.handleEditDelete}>
                  save
                </Button>
                <Button id="cancel" onClick={this.closeModal}>
                  cancel
                </Button>
              </div>
            </CustomModal>
          )}
        </Column>
      </div>
    );
  }
}

class ExerciseInput extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      date: "",
      errMsg: "",
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "name":
        this.setState({ name: value });
        break;
      case "description":
        this.setState({ description: value });
        break;
      case "date":
        this.setState({ date: value });
        break;
      default:
        return;
    }
  }

  handleSave(e) {
    let name = this.state.name;
    let description = this.state.description;
    let date = this.state.date;

    //  store this row's (defined by this.state.rowNum) state data: name, progress, and date
    //  if err, this.setState({errMsg: err})
    const data = {
      name: name,
      desc: description,
      date: date,
    };

    axios
      .post("http://localhost:3001/grid/save-grid-data", data)
      .then((res) => {
        let err = res.data.saveGridError;
        if (err) {
          this.setState({ errMsg: err });
        } else {
          // Reload the page
          window.location.reload(false);
        }
      });
  }

  render() {
    return (
      <div className="Row">
        <Row horizontal="center">
          <Error>{this.state.errMsg}</Error>
        </Row>
        <Row horizontal="center">
          <Column flexGrow={0} horizontal="center">
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="name"
              onChange={this.handleChange}
            ></Input>
          </Column>
          <Column flexGrow={0} horizontal="center">
            <Input
              id="date"
              type="text"
              name="date"
              placeholder="mm/dd/yyyy"
              onChange={this.handleChange}
            ></Input>
          </Column>
          <Column flexGrow={0} horizontal="center">
            <Input
              id="description"
              type="text"
              name="description"
              placeholder="description"
              onChange={this.handleChange}
            ></Input>
          </Column>
          <Column flexGrow={0} horizontal="center">
            <Button id="add" onClick={this.handleSave}>
              add exercise
            </Button>
          </Column>
        </Row>
      </div>
    );
  }
}

export default Grid;
