import { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import {
  check,
  DispathContext,
  remove,
  UserContext,
} from "./context/UserProvider";
import Chat from "./views/Chat";
import Home from "./views/Home";
import Regist from "./views/Regist";

function App() {
  const user = useContext(UserContext);
  const dispatch = useContext(DispathContext);
  const navigate = useNavigate();
  const isSigned = () => user !== null && user;

  useEffect(() => {
    dispatch(check());
  }, []);

  return (
    <Layout>
      <Layout.Header>
        <h1>Socket IO</h1>
      </Layout.Header>
      <Layout.Routes>
        <Layout.Route to='/'>home</Layout.Route>
        {!isSigned() && <Layout.Route to='/regist'>regist</Layout.Route>}
        {isSigned() && (
          <button
            onClick={(e) => {
              dispatch(remove());
              navigate("/");
            }}>
            유저 삭제
          </button>
        )}
        <Layout.Route to='/chat'>chat</Layout.Route>
      </Layout.Routes>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/regist' element={<Regist user={user} />} />
        <Route path='/chat' element={<Chat user={user} />} />
      </Routes>
    </Layout>
  );
}

export default App;
