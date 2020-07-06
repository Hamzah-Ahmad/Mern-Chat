/* eslint-disable */
import axios from "axios";
import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";

import "./App.css";
import AuthScreen from "./screens/Auth/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";

import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App(props) {
  //AuthContextProvider tag is wrapping the App tag in the index.js file
  const { isLoggedIn, token, user, loginFunc, logoutFunc } = useContext(
    AuthContext
  );
  // socket.on("message", (message) => {
  //   console.log(message);
  // });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      loginFunc(storedData.token, storedData.user);
      props.history.replace(props.location.pathname);
    }
  }, []);

  return (
    <div className="App">
      <Route exact path="/auth" component={AuthScreen} />
      <ProtectedRoute exact path="/" component={HomeScreen} />
      <ProtectedRoute exact path="/chat/:room" component={ChatScreen} />
    </div>
  );
}

export default withRouter(App);
