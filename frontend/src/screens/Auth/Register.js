import axios from "axios";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// Material UI imports
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const Register = ({ history, mediaMatch, setBackDrop }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginFunc } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (name === "" || email === "" || password === "") {
      setError({ msg: "Fields cannot be empty" });
      return;
    }

    if (password.length < 5) {
      setError({ msg: "Password must be atleast3 characters long" });
      return;
    }
    let body = { name, email, password };
    body = JSON.stringify(body);

    axios
      .post("/auth/register", body, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((res) => {
        console.log(res);
        loginFunc(res.data.token, res.data.user);
        history.push("/");
      })
      .catch((err) => {
        console.log(err.response.data);
        setError(err.response.data);
      });
  };

  return (
    <div style={mediaMatch ? style.container : style.mobileContainer}>
      <div style={mediaMatch ? style.title : style.mobileTitle}>Register</div>
      {error && <div style={style.error}>{error.msg}</div>}

      <form onSubmit={handleSubmit}>
        <TextField
          style={style.textField}
          variant="outlined"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
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
    height: "35vh",
    backgroundColor: "#f2f2f2",
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
export default Register;
