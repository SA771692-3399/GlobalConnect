import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { NavigateToProvider } from "./provider/AuthProvider";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
