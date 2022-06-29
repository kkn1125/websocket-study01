import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

let socket;
let userName;

function Chat({ user }) {
  const navigate = useNavigate();
  const chatting = useRef();
  const [input, setInput] = useState("");
  useEffect(() => {
    setTimeout(() => {
      if (user !== null && !user) {
        alert("유저를 등록해야 사용가능합니다.");
        navigate("/regist");
      }
    }, 100);
    socket = io("ws://localhost:3001");
    socket.on("connection", (connection) => {
      console.log(connection);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    socket.emit("chat message", {
      who: userName,
      msg: input,
    });
    setInput("");
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleOut = () => {
    navigate("/");
  };

  return (
    <div>
      <div ref={chatting}></div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          return;
        }}>
        <input onChange={handleChange} value={input} type='text' />
      </form>
      <button onClick={handleOut}>나가기</button>
    </div>
  );
}

export default Chat;
