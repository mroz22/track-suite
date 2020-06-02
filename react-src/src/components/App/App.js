import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';

import Table from '../Table';

import logo from '../../tracksuite.jpg';
import './App.css';

const App = () => {
  const server = process.env.REACT_APP_API_URL || '';
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios.get(`${server}/api/test-records/`)
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    fetchData();
  }, [])
  

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
          data={data}
        />
      </Container>
      <br/>
    </div>
  );
}

export default App;
