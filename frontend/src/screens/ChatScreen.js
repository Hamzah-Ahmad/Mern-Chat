/* eslint-disable */
import React, { useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
// const socket = io("http://localhost:5000");
const socket = io("/");
import { AuthContext } from "../context/AuthContext";
import ChatBubble from "../components/ChatBubble";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const ChatScreen = (props) => {
  const { isLoggedIn, token, user, loginFunc, logoutFunc } = useContext(
    AuthContext
  );
  const [message, setMessage] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertOpacity, setAlertOpacity] = useState(0);
  const room = props.match.params.room;
  const mediaMatch = useMediaQuery("(min-width:700px)");
  const [messages, setMessages] = useState([]);

  const messagesRef = useRef();
  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { user, message });
    setMessage("");
  };

  const leaveRoom = () => {
    // socket.emit("leaveRoom", room); //we don't need to emit leaveroom because the cleanup function in our chat component already accomplishes this task
    props.history.push("/");
  };
  useEffect(() => {
    // console.log(room);
    let mounted = true;
    socket.emit("joinRoom", { user, room });
    socket.on("message", (message) => {
      console.log(message.user.email);
      console.log(user.email);
      setMessages((messages) => [
        ...messages,
        { user: message.user, message: message.message },
      ]);
    });
    socket.on("welcomeUser", (msg) => {
      setAlertText(msg);
      setAlertOpacity(0.8);
      setTimeout(() => {
        setAlertOpacity(0);
      }, 2000);
    });
    return () => {
      socket.emit("leaveRoom");

      mounted = false;
    };
  }, []);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  });

  return (
    <div style={mediaMatch ? style.container : null}>
      <div style={mediaMatch ? style.navbar : null}>
        <div
          style={
            mediaMatch ? style.logo : { ...style.logo, textAlign: "center" }
          }
        >
          MernChat
        </div>
        <div style={!mediaMatch ? { textAlign: "center" } : null}>
          <Button onClick={leaveRoom} style={{ color: "#fff" }}>
            Leave Room
          </Button>
          <Button onClick={logoutFunc} style={{ color: "#fff" }}>
            Logout
          </Button>
        </div>
      </div>
      <div style={{ ...style.alertBox, opacity: alertOpacity }}>
        {alertText}
      </div>
      <div style={mediaMatch ? style.chatContainer : style.mobileChatContainer}>
        <div style={style.messagesContainer} ref={messagesRef}>
          <div style={style.roomTitle}>{room}:</div>
          {messages.map((msg) => (
            <ChatBubble
              key={Math.random()}
              user={msg.user.name}
              message={msg.message}
              sentMsg={msg.user.email === user.email}
            />
          ))}
        </div>
        <form onSubmit={submitHandler} style={{ marginTop: 40 }}>
          <TextField
            type="text"
            multiline
            rowsMax={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            variant="outlined"
            style={style.input}
          />
          <Button
            variant="contained"
            type="submit"
            style={message ? style.button : style.disabledButton}
            disabled={message ? false : true}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

const style = {
  alertBox: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  button: {
    background: "#407ad6",
    color: "#fff",
    width: "100%",
    marginTop: 10,
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    padding: 40,
    margin: "auto",
    borderRadius: 20,
    backgroundColor: "#edf4ff",
    height: "70vh",
  },
  container: {
    width: "80%",
  },
  disabledButton: {
    background: "#e0e0e0",
    color: "#fff",
    width: "100%",
    marginTop: 10,
  },
  input: {
    width: "100%",
    marginTop: 10,
    background: "#f7f7f7",
  },
  logo: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    spaceBetween: "1.5",
  },
  messagesContainer: {
    overflow: "auto",
    padding: 30,
    paddingRight: 60,
    borderRadius: 20,
    border: "1px solid #f7f7f7",
    background: "#f7f7f7",
    display: "flex",
    flexDirection: "column",
    minHeight: "30vh",
  },
  mobileChatContainer: {
    display: "flex",
    flexDirection: "column",
    width: "80vw",
    padding: 10,
    margin: "auto",
    borderRadius: 20,
    backgroundColor: "#edf4ff",
    height: "70vh",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "30px 0px",
  },
  roomTitle: {
    color: "gray",
    textAlign: "center",
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 10,
  },
};

export default ChatScreen;
