import { css, cx } from "@emotion/css";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Layout from "../components/Layout";
import { check } from "../context/UserProvider";

let socket;

function Chat({ user, dispatch }) {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [isWriting, setIsWriting] = useState({
    who: user,
    wt: false,
  });
  const [input, setInput] = useState("");
  useEffect(() => {
    if (user === null) return;
    dispatch(check());

    if (user === "") {
      navigate("/regist");
    }

    socket = io("ws://localhost:3001");
    socket.on("connect", () => {
      socket.on("chat message", (msg) => {
        setChatList(msg);
      });
      socket.on("is writing", (wt) => {
        setIsWriting({ ...wt });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    socket.emit("is writing", {
      who: user,
      wt: input !== "",
    });
  }, [input]);

  const handleSubmit = (e) => {
    socket.emit("chat message", {
      who: user,
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

  const shareStyle = css`
    flex: 1;
    border: 1px solid #959595;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 5px;
    outline: none;
  `;

  return (
    <Layout.Body>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          gap: 15px;
        `}>
        {chatList.map((chat, idx) => (
          <div
            key={chat.msg + idx}
            className={cx(
              css`
                display: flex;
                flex-direction: column;
                align-items: ${chat.who === user ? "flex-end" : "flex-start"};
                gap: 10px;
              `,
              "wrap"
            )}>
            {chat.who !== user && <div className={cx("user")}>{chat.who}</div>}
            <div
              className={css`
                position: relative;
                width: 45%;
                border-radius: 10px;
                padding: 1rem;
                color: black;
                background-color: ${chat.who === user ? "#ffea3b65" : "white"};
                border-style: solid;
                border-width: 3px;
                border-color: ${chat.who === user ? "#ffea3ba9" : "#95959565"};
              `}>
              {chat.msg}
            </div>
          </div>
        ))}
        {isWriting.who !== user && isWriting.wt && (
          <div
            className={cx(
              css`
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
              `,
              "wrap"
            )}>
            <div className={"user"}>{isWriting.who}</div>
            <div
              className={css`
                position: relative;
                border-radius: 10px;
                padding: 1rem;
                color: black;
                background-color: white;
                border-style: solid;
                border-width: 3px;
                border-color: #95959565;
              `}>
              <span
                className={css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  span {
                    @keyframes rotation {
                      0% {
                        opacity: 0;
                        transform: rotate(0deg);
                      }
                      50% {
                        opacity: 1;
                      }
                      100% {
                        opacity: 0;
                        transform: rotate(359deg);
                      }
                    }
                    display: inline-block;
                    text-align: center;
                    transform-origin: 50% 55%;
                    animation: rotation linear 1s infinite;
                  }
                `}>
                <span className={css``}>⚙️</span>
              </span>
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          return;
        }}
        className={css`
          display: flex;
          margin-top: 1rem;
        `}>
        <input
          onChange={(e) => {
            handleChange(e);
          }}
          value={input}
          type='text'
          className={cx(
            shareStyle,
            css`
              padding-left: 10px;
            `
          )}
        />
      </form>
      <button
        onClick={handleOut}
        className={cx(
          shareStyle,
          css`
            margin-top: 1rem;
            width: 100%;
            background-color: #ff3b6565;
            border-color: #ff3b65;
          `
        )}>
        나가기
      </button>
    </Layout.Body>
  );
}

export default Chat;
