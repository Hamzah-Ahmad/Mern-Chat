import React from "react";

const ChatBubble = ({ user, message, sentMsg }) => {
  return (
    <div>
      <div style={!sentMsg ? style.chatbubble : style.sentMsgBubble}>
        <div style={style.username}>{user}:</div>
        <span style={style.messageText}>{message}</span>
      </div>
    </div>
  );
};
const style = {
  chatbubble: {
    marginBottom: 20,
    padding: 10,
    border: "0.1px solid #33a0ff",
    borderRadius: "20px",
    width: "60%",
  },
  sentMsgBubble: {
    marginBottom: 20,
    padding: 10,
    border: "0.1px solid #324a7a",
    borderRadius: "20px",
    width: "60%",
    marginLeft: "auto",
  },
  username: {
    fontSize: 12,
    color: "#808080",
  },
  messageText: {},
};
export default ChatBubble;
