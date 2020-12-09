import React, { useEffect, useState } from "react";

import Router from "../Router";

import logo from "../../tracksuite.jpg";
import "./App.css";

const App = () => {
  return (
    <div>
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-intro">=== TRACK SUITE ===</h1>
        </div>
      </div>
      <Router />
    </div>
  );
};

export default App;
