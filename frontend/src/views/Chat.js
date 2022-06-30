import { ClassNames, css } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Layout from "../components/Layout";
import { check } from "../context/UserProvider";

let socket;

function Chat({ user, dispatch }) {
  const navigate = useNavigate();
  const chatboard = useRef();
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
        setTimeout(() => {
          chatboard.current.scrollTo(0, chatboard.current.scrollHeight);
        }, 100);
      });
      socket.on("out", (wt) => {
        setChatList(wt);
      });
    });

    return () => {
      socket.emit("out", user);
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      chatboard.current.scrollTo(0, chatboard.current.scrollHeight);
    }, 100);
  }, [chatList]);

  useEffect(() => {
    if (socket === undefined) return;
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
    cursor: pointer;
    flex: 1;
    border: 1px solid #959595;
    padding-top: 10px;
    padding-bottom: 10px;
    outline: none;
  `;

  return (
    <ClassNames>
      {({ css, cx }) => (
        <Layout.Body>
          <div
            ref={chatboard}
            css={css`
              padding: 1rem;
              background-color: #b4d0e9;
              display: flex;
              flex-direction: column;
              gap: 15px;
              min-height: 300px;
              max-height: 300px;
              overflow: auto;
              &::-webkit-scrollbar {
                background-color: transparent;
                width: 16px;
                height: 16px;
              }
              &::-webkit-scrollbar-thumb {
                background: #aaa;
                border-radius: 16px;
                width: 16px;
                height: 8px;
                border: 5px solid #b4d0e9;
              }
            `}>
            {chatList.map((chat, idx) => (
              <div
                key={chat.msg + idx}
                className={cx(
                  css`
                    display: flex;
                    flex-direction: column;
                    align-items: ${chat.who === user
                      ? "flex-end"
                      : "flex-start"};
                    gap: 10px;
                  `
                )}>
                {chat.who !== "server" &&
                  chat.who !== user &&
                  (idx === 0 ||
                    (idx > 0 && chatList[idx - 1].who !== chat.who)) && (
                    <div className={cx("user")}>{chat.who}</div>
                  )}
                <div
                  css={
                    chat.who === "server"
                      ? css`
                          font-size: 12px;
                          color: #333;
                        `
                      : css`
                          position: relative;
                          width: 45%;
                          border-radius: 5px;
                          padding: 0.5rem 1rem;
                          color: black;
                          background-color: ${chat.who === user
                            ? "#ffea3b"
                            : "white"};
                          border-style: solid;
                          border-width: 1px;
                          border-color: ${chat.who === user
                            ? "#ffea3b"
                            : "#959595"};
                        `
                  }>
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
                  css={css`
                    position: relative;
                    border-radius: 5px;
                    padding: 0.5rem 1rem;
                    color: black;
                    background-color: white;
                    border-style: solid;
                    border-width: 1px;
                    border-color: #95959565;
                  `}>
                  <span
                    css={css`
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      span:last-child {
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
                        transform-origin: 48% 54%;
                        animation: rotation linear 1s infinite;
                      }
                    `}>
                    <span>입력 중 ...</span>
                    <span>⚙️</span>
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
            css={css`
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
                css(shareStyle),
                css`
                  padding-left: 10px;
                `
              )}
            />
          </form>
          <button
            onClick={handleOut}
            className={cx(
              css(shareStyle),
              css`
                margin-top: 0.3rem;
                width: 100%;
                background-color: #ff3b6565;
                border-color: #ff3b65;
              `
            )}>
            ❌
          </button>
        </Layout.Body>
      )}
    </ClassNames>
  );
}

export default Chat;
