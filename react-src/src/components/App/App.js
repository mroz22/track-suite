import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';

import Table from '../Table';

import logo from '../../tracksuite.jpg';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';

    this.state = {
      data: [],
      online: 0
    }

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  // Fetch data from the back-end
  fetchData() {
    axios.get(`${this.server}/api/test-records/`)
    .then((response) => {
      console.log(response);
      this.setState({ data: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <div>
        <div className='App'>
          <div className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-intro'>=== TRACK SUITE ===</h1>
          </div>
        </div>
        <Container>
          <Table
            data={this.state.data}
          />
        </Container>
        <br/>
      </div>
    );
  }
}

export default App;
