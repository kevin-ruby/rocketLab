import React, { Component } from "react";
import { Container, Nav } from "./styled-components";
import { CsvToHtmlTable } from "react-csv-to-table";
import logo from "./Rocket_Lab_logo_(2016).svg";
import logo2 from "./Rocket_Lab_logo.svg";
import Button from "react-bootstrap/Button";
import { Circles } from "react-loader-spinner";

// import config from "./config";
import Dropdown from "react-dropdown";

import { ThemeProvider } from "styled-components";

// How would you turn this timer into a refreshing timer.  i.e. after the time expires, refresh the page
// It should show that something had changed in the data without mucking with the backend.
/**
   Kevin Notes: 
   To Simplify this process, I created the timer functionality within the main app class. 
   It would have been tricky to force a data reset every x seconds with the timer being its 
   own class and state, as we would have had to share state info across classes. 
   */

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedValue: null,
      optionList: null,
      dataList: null,
      seconds: 0,
      loading: true,
    };
  }

  // How would you add a method as part of this component to add data to the data set?
  /**
   Kevins Notes:
   Adding data to this Data set wouldnt be too big of a haul. 
   It is tough right now as we just have a hard coded json object of the data, and adding a value would have 
   to change this hard coded object. If we were connected to a database, posting would be as easy as adding a row 
   to the DB. 

   If I were to create it here, it would look something like this: 
   
   • button for user to add value to dataset. 
   • upon click of this button, a modal will pop up. This modal will have boxes for 
     each field in the JSON, in this case it would be measurement,time,value,apid.
   • modal will have a 'submit' button. 
   • this button will trigger the following function:  
      addValue = async (event) => {
        let response = await fetch(`http://localhost:3001/satelliteAddition, 
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({measurement: testMeasurment, time: testTime, value: testValue, apid: testApid})
      });    
    }
   • in the backend, server.js will have the following function:
        app.post("/satelliteAddition", async (req, res) => {
          const result = await satellite.postData(req);
        });
      • we would also have postData(req) functionality built out in satellite.js, which would use SQL to add row to DB. 
   • finally, I would likely make this addValue() class function call refreshData(), which will, well, refresh the data displayed. 
   */

  // Select a Satellite
  updateDashboard = async (event) => {
    this.setState({ selectedValue: event.value });
    this.componentWillUnmount();
    this.startTimer();
  };

  startTimer() {
    this.state.seconds = 0;
    this.interval = setInterval(() => this.tick(), 1000);
  }

  // reset entire dashboard
  resetDashboard = async (event) => {
    this.setState({ selectedValue: null, seconds: 0 });
    this.componentWillUnmount();
    this.componentDidMount();
  };

  refreshData = async (event) => {
    this.state.loading = true;
    this.componentWillUnmount();

    let response = await fetch(`http://localhost:3001/satellite`);
    let res = await response.json();
    let data = res.data;
    let telemetry = {};
    for (let i = 0; i < data.length; i += 1) {
      telemetry[data[i].Spacecraft] = data[i].csv_telemetry;
    }
    await this.setState({ dataList: telemetry });
    this.startTimer();
    this.state.loading = false;
  };

  tick() {
    if (this.state.seconds > 60) {
      this.refreshData();
    }
    this.setState((state) => ({
      seconds: state.seconds + 1,
    }));
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async componentDidMount() {
    let response = await fetch(`http://localhost:3001/satellite`);
    console.log(fetch);
    let res = await response.json();
    let data = res.data;
    console.log(res);
    let options = [];
    options.push({ label: "Please Select a Satellite ", value: null });
    let telemetry = {};
    for (let i = 0; i < data.length; i += 1) {
      options.push({ label: data[i].Spacecraft, value: data[i].Spacecraft });
      telemetry[data[i].Spacecraft] = data[i].csv_telemetry;
    }
    console.log("t", telemetry);
    await this.setState({ optionList: options, dataList: telemetry });
    this.state.loading = false;
  }

  render() {
    if (!this.state.dataList || !this.state.optionList) {
      console.log("Inside if condition");
      return <div />;
    }
    let tableOrLoader;
    if (this.state.loading) {
      tableOrLoader = (
        <header className="App-header">
          <Circles
            color="rgb(128, 145, 171)"
            style={{ height: "100%", width: "100%" }}
          />
          ;
        </header>
      );
    } else {
      tableOrLoader = (
        <Container className="row" style={{ minHeight: "450px" }}>
          {/* Every single row will wrap when column is larger than 12s*/}
          <Container className="col-md-5 col-lg-4 is-light-text mb-4">
            <Container className="card grid-card is-card-dark">
              <Container className="card-heading mb-3">
                <Container className="is-dark-text-light letter-spacing text-large text-center">
                  <img
                    src={logo2}
                    alt="logo"
                    style={{ height: "100%", width: "100%" }}
                    class=""
                  />
                  Elapsed Seconds: {this.state.seconds}
                  {/* <!-- Instead of making the user refresh by resetting, why not simply add a refresh button? --> 
                  Kevins Notes: 
                  Done and done! good call to add ability to refresh data without resetting entire page.
                  */}
                  <hr color="black" />
                  Here at RocketLab, we take every step to ensure data is fresh.
                  The data displayed will be automatically refreshed every 60
                  seconds. You can also manually refresh the data using the
                  button below.{"\n"}
                  <br></br>
                  <Button
                    size="lg"
                    padding="10"
                    variant="outline-primary"
                    onClick={this.refreshData}
                  >
                    Refresh Data
                  </Button>{" "}
                </Container>
              </Container>
              <Container className="card-value pt-4 text-x-large"></Container>
            </Container>
          </Container>

          <Container className="col-md-4 col-lg-8 is-light-text mb-4">
            <Container className="card grid-card is-card-dark">
              <Container>
                {" "}
                <CsvToHtmlTable
                  data={this.state.dataList[this.state.selectedValue]}
                  csvDelimiter=","
                  tableClassName="table table-dark table-striped table-hover th-lg"
                />
              </Container>
            </Container>
          </Container>
        </Container>
      );
    }
    let imgOrTable;
    if (!this.state.selectedValue) {
      imgOrTable = (
        <header className="App-header">
          <img
            src={logo}
            alt="logo"
            style={{ height: "100%", width: "100%" }}
            class="App-logo"
          />
        </header>
      );
    } else {
      // A bunch of HTML in the JS can make it wordy and a bit hard to follow.  Would it be better to reference this code?
      /*
      Kevins Notes: 
      I agree, it is messy. Conditional rendering is the reason I have HTML up in this JS section. To clean this up,
      I can have HTML live in a seperate file and import that file. Only issue I can see arise is some of this HTML
      is reliant on current state values.

       */
      imgOrTable = tableOrLoader;
    }
    return (
      <Container>
        {/* static navbar - bottom */}
        <Nav className="navbar navbar-expand-lg fixed-top is-dark is-light-text">
          <Container className="text-medium">RocketLab Data Analysis</Container>
          <Container className="navbar-nav ml-auto">
            <Dropdown
              className="pr-2 custom-dropdown"
              options={this.state.optionList}
              onChange={this.updateDashboard}
              value={this.state.selectedValue}
              placeholder="Please Select a Satellite"
              S
            />
            <div className="d-grid gap-2">
              <Button
                size="lg"
                variant="outline-danger"
                onClick={this.resetDashboard}
              >
                Reset
              </Button>{" "}
            </div>
          </Container>
        </Nav>

        {/* content area start */}
        <Container className="container-fluid pr-5 pl-5 pt-5 pb-5">
          {/* row 2 - conversion */}
          {/* Every single row will wrap when column is larger than 12s*/}
          {imgOrTable}
        </Container>
        {/* content area end */}
      </Container>
    );
  }
}

export default App;
