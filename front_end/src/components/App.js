import React, { Component } from "react";
import { Container, Nav } from "./styled-components";
import { CsvToHtmlTable } from "react-csv-to-table";
import logo from "./Rocket_Lab_logo_(2016).svg";
import logo2 from "./Rocket_Lab_logo.svg";
import Button from "react-bootstrap/Button";

// import config from "./config";
import Dropdown from "react-dropdown";

import { ThemeProvider } from "styled-components";

class Timer extends React.Component {
  // How would you turn this timer into a refreshing timer.  i.e. after the time expires, refresh the page
  // It should show that something had changed in the data without mucking with the backend.
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState((state) => ({
      seconds: state.seconds + 1,
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return React.createElement(
      "div",
      null,
      "Elapsed Seconds: ",
      this.state.seconds
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedValue: null,
      optionList: null,
      dataList: null,
    };
  }

  // How would you add a method as part of this component to add data to the data set?

  // Select a Satellite
  updateDashboard = async (event) => {
    this.setState({ selectedValue: event.value });
    console.log("On Change Works", event.value);
  };

  // Select a Satellite
  resetDashboard = async (event) => {
    this.setState({ selectedValue: null });
    this.componentDidMount();
  };

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
  }

  render() {
    if (!this.state.dataList || !this.state.optionList) {
      console.log("Inside if condition");
      return <div />;
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
      imgOrTable = (
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
                  <Timer></Timer>
                  <!-- Instead of making the user refresh by resetting, why not simply add a refresh button? -->
                  <hr color="black" />
                  Here at RocketLab, we take every step to ensure data is fresh.
                  Please note the timer above and refresh data as necessary
                  using the reset button in the top right.{"\n"}
                  <br></br>
                </Container>
              </Container>
              <Container className="card-value pt-4 text-x-large"></Container>
            </Container>
          </Container>

          <Container className="col-md-4 col-lg-8 is-light-text mb-4">
            <Container className="card grid-card is-card-dark">
              <Container>
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
