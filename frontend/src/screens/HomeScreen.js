/* eslint-disable */

import React, { useState, useContext } from "react";
import ChatScreen from "./ChatScreen";
import { AuthContext } from "../context/AuthContext";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const HomeScreen = (props) => {
  const { isLoggedIn, token, user, loginFunc, logoutFunc } = useContext(
    AuthContext
  );
  const mediaMatch = useMediaQuery("(min-width:700px)");

  // let [room, setRoom] = useState("General");
  const [textInput, setTextInput] = useState("");
  const [selectInput, setSelectInput] = useState("General");
  const handleChange = (e) => {
    setRoom(e.target.value);
  };
  const enterRoom = () => {
    // room = room.split(" ").join("_");
    // console.log(room);
    // props.history.push(`chat/${room}`);

    let room;
    if (textInput) {
      room = textInput;
    } else {
      room = selectInput;
    }
    room = room.split(" ").join("_");
    props.history.push(`chat/${room}`);
  };

  // useEffect(() => console.log(room));
  return (
    <div style={mediaMatch ? style.container : null}>
      <div style={style.navbar}>
        <div style={style.logo}>MernChat</div>
        <Button onClick={logoutFunc} style={{ color: "#fff" }}>
          Logout
        </Button>
      </div>
      <div
        style={
          mediaMatch
            ? { ...style.formContainer, width: "50%" }
            : style.formContainer
        }
      >
        <form>
          <div>Select a room:</div>
          <select
            value={selectInput}
            onChange={(e) => setSelectInput(e.target.value)}
            style={style.select}
            disabled={textInput ? true : false}
          >
            <option value="General">General</option>
            <option value="Programming">Programming</option>
            <option value="Video Games">Video Games</option>
            <option value="Music">Music</option>
          </select>
        </form>
        <div>Or enter a room name: </div>
        {/* <input type="text" onChange={(e) => setTextInput(e.target.value)} /> */}
        <TextField
          style={style.textField}
          variant="outlined"
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Custom Room Name"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={enterRoom}
          style={style.button}
        >
          Enter Room
        </Button>
      </div>
    </div>
  );
};

const style = {
  button: {
    marginTop: 20,
    width: "100%",
    background: "#407ad6",
  },
  container: {
    width: "80%",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 70,
    margin: "auto",
    marginTop: 100,
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
  },
  logo: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    spaceBetween: "1.5",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "30px 0px",
    alignItems: "baseline",
  },
  select: {
    display: "block",
    fontSize: "16px",
    fontWeight: 700,
    color: "#444",
    lineHeight: 1.3,
    padding: ".6em 1.4em .5em .8em",
    width: "100%",
    maxWidth: "100%" /* useful when width is set to anything other than 100% */,
    boxSizing: "border-box",
    margin: 0,
    border: "1px solid #aaa",
    boxShadow: "0 1px 0 1px rgba(0,0,0,.04)",
    borderRadius: ".5em",
    marginTop: 10,
    marginBottom: 20,
  },
  textField: {
    paddingTop: 10,
  },
};

export default HomeScreen;
