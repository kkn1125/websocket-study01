import { ClassNames, css } from "@emotion/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Layout from "../components/Layout";
import { check } from "../context/UserProvider";

let socket;

const collector = (arr, user) =>
  arr.reduce(
    (acc, cur) =>
      acc.indexOf(cur.who) === -1 && cur.who !== "server" && cur.who !== user
        ? (acc.push(cur.who), acc)
        : acc,
    []
  );

function Chat({ user, dispatch }) {
  const navigate = useNavigate();
  const chatboard = useRef();
  const [users, setUsers] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [isWriting, setIsWriting] = useState([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    if (user === null) return;
    dispatch(check());

    if (user === "") {
      navigate("/regist");
    }

    socket = io("ws://192.168.1.52:3001");
    socket.on("connect", () => {
      socket.on("chat message", (msg) => {
        setChatList(msg);
        setUsers(collector(msg, user));
      });
      socket.on("is writing", (wt) => {
        setIsWriting(collector(wt, user));
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
    if (input === "") {
      socket.emit("remove history", user);
    }
  }, [input]);

  const handleSubmit = (e) => {
    if (input === "") return;
    console.log(input === "");
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
            css={css`
              border-bottom: 1px solid #aaa;
              background-color: inherit;
              font-size: 12px;
            `}>
            <span>{users.join(", ")}</span>
            <span> 친구{users.length > 1 ? "들과" : "와"} 채팅</span>
          </div>
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
              <>
                <span
                  css={css`
                    display: flex;
                    justify-content: ${chat.who === user
                      ? "flex-end"
                      : "flex-start"};
                    gap: 10px;
                  `}>
                  {chat.who !== "server" &&
                    chat.who !== user &&
                    (idx === 0 ||
                      (idx > 0 && chatList[idx - 1].who !== chat.who)) && (
                      <img
                        src='http://img.danawa.com/prod_img/500000/150/707/img/4707150_1.jpg?shrink=500:500&_v=20181122111406'
                        alt=''
                        css={css`
                          width: 32px;
                          height: 32px;
                          border-radius: 50%;
                        `}
                      />
                    )}
                  <div
                    key={chat.msg + idx}
                    className={cx(
                      css`
                        display: flex;
                        flex-direction: column;
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
                              font-size: 10px;
                              color: #333;
                            `
                          : css`
                              position: relative;
                              border-radius: 5px;
                              font-size: 12px;
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
                </span>
              </>
            ))}
            {isWriting.length > 0 &&
              isWriting.map(
                (wrt, idx) =>
                  wrt !== user && (
                    <span
                      css={css`
                        display: flex;
                        justify-content: ${wrt === user
                          ? "flex-end"
                          : "flex-start"};
                        gap: 10px;
                      `}>
                      <div
                        css={css`
                          @keyframes placeholder {
                            0% {
                              left: -100%;
                            }
                            100% {
                              left: 100%;
                            }
                          }
                          width: 32px;
                          height: 32px;
                          border-radius: 50%;
                          background-color: #ccc;
                          position: relative;
                          overflow: hidden;
                          &::after {
                            display: inline-block;
                            width: 32px;
                            height: 32px;
                            content: "";
                            position: absolute;
                            background: linear-gradient(
                              90deg,
                              transparent,
                              rgba(0, 0, 0, 0.04),
                              transparent
                            );
                            animation: placeholder 1s linear infinite;
                            animation-duration: 2s;
                          }
                        `}></div>
                      <div
                        key={idx}
                        className={cx(
                          css`
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 10px;
                          `,
                          "wrap"
                        )}>
                        <div className={"user"}>{wrt}</div>
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
                            <span
                              css={css`
                                font-size: 12px;
                              `}>
                              입력 중 ...&nbsp;
                            </span>
                            <span
                              css={css`
                                font-size: 12px;
                              `}>
                              ⚙️
                            </span>
                          </span>
                        </div>
                      </div>
                    </span>
                  )
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
