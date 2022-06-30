import { css } from "@emotion/react";
import { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import {
  check,
  DispatchContext,
  remove,
  UserContext,
} from "./context/UserProvider";
import Chat from "./views/Chat";
import Home from "./views/Home";
import Regist from "./views/Regist";

function App() {
  const user = useContext(UserContext);
  const dispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(check());
  }, []);

  return (
    <Layout>
      <Layout.Header>
        <h1>Socket IO</h1>
        <Layout.Routes>
          <Layout.Route to='/'>home</Layout.Route>
          {user !== "" && <Layout.Route to='/chat'>chat</Layout.Route>}
          {user === "" && <Layout.Route to='/regist'>regist</Layout.Route>}
          {user !== "" && (
            <button
              onClick={(e) => {
                dispatch(remove());
                navigate("/");
              }}
              css={css`
                border: 1px solid #aa8888;
                border-radius: 5px;
                background-color: #aa222255;
                color: white;
                padding: 0.3rem 0.5rem;
              `}>
              유저 삭제
            </button>
          )}
        </Layout.Routes>
      </Layout.Header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/regist'
          element={<Regist user={user} dispatch={dispatch} />}
        />
        <Route
          path='/chat'
          element={<Chat user={user} dispatch={dispatch} />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
