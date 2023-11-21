import React, { useState } from "react";
import logo from "../campushare.png";
import "../css/chat.css";
import Navbar from "../js/navbar";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage) {
      const updatedMessages = [
        ...messages,
        { text: newMessage, sender: "You", userPic: logo },
      ];
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  return (
    <><div className="chat-container">
      <div className="chat-header">
        <h2>Mountain View Chat</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <img src={logo} alt="User Pic" />
            <div className="message-content">
              <p className="sender">{message.sender}</p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)} />
        <button className="send" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
      <Navbar />
   </>

  );
}

export default Chat;
