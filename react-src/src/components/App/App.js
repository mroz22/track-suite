import React, { useEffect, useState } from "react";
import { Container, Header } from "semantic-ui-react";
import axios from "axios";

import Table from "../Table";

import logo from "../../tracksuite.jpg";
import legs from "../../fried-frog-legs.jpg";
import "./App.css";

// import data from '../Table/index.test';

const App = () => {
  const server = process.env.REACT_APP_API_URL || "";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${server}/api/test-records/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-intro">=== TRACK SUITE ===</h1>
        </div>
      </div>
      <div>
        {!loading && <Table data={data} />}

        {loading && "loading..."}

        {(!data || !data.length) && !loading && (
          <Container textAlign="center">
            <Header>
              No data here :( You may still enjoy these crunchy fried frog legs
            </Header>
            <img src={legs} />
          </Container>
        )}
      </div>
      <br />
    </div>
  );
};

export default App;
