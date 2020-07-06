/* eslint-disable */

import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

// Material UI imports
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const Login = ({ history, mediaMatch, setBackDrop }) => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoggedIn, token, user, loginFunc, logoutFunc } = useContext(
    AuthContext
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (email == "" || password == "") {
      setError({ msg: "Fields cannot be empty" });
      return;
    }

    let body = { email, password };
    body = JSON.stringify(body);
    setBackDrop(true);
    axios
      .post("/auth/login", body, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((res) => {
        // console.log(res.data);
        loginFunc(res.data.token, res.data.user);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        setBackDrop(false);
        setError(err.response.data);
      });

    // setEmail("");
    // setPassword("");
  };

  useEffect(() => {
    // console.log(isLoggedIn);
    if (isLoggedIn) {
      history.push("/");
    }
  }, []);
  return (
    <div style={mediaMatch ? style.container : style.mobileContainer}>
      <div style={mediaMatch ? style.title : style.mobileTitle}>Login</div>
      {error && <div style={style.error}>{error.msg}</div>}
      <form onSubmit={handleSubmit}>
        <TextField
          style={style.textField}
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <TextField
          style={style.textField}
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={mediaMatch ? style.button : style.mobileButton}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

const style = {
  button: {
    width: "100%",
    position: "absolute",
    height: "60px",
    bottom: 0,
    left: 0,
    backgroundColor: "#407ad6",
  },
  container: {
    borderRadius: 20,
    padding: 50,
    margin: 50,
    marginTop: "5%",
    backgroundColor: "#f2f2f2",
    height: "35vh",
    width: "50%",
    position: "relative",
  },
  error: {
    color: "#a33122",
    textAlign: "center",
    marginTop: 0,
  },
  mobileButton: {
    width: "100%",
    backgroundColor: "#407ad6",
  },
  mobileContainer: {
    borderRadius: 10,
    padding: 25,
    width: "80vw",
    margin: "0 auto",
    backgroundColor: "#f2f2f2",
    position: "relative",
  },
  mobileTitle: { fontSize: 30, marginBottom: 10, textAlign: "center" },
  textField: {
    paddingBottom: 15,
    width: "100%",
  },
  title: {
    fontSize: 45,
    marginBottom: 10,
    textAlign: "center",
  },
};

export default Login;
