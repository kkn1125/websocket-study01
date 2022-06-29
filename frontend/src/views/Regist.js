import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { add, DispatchContext } from "../context/UserProvider";

function Regist({ user, dispatch }) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      alert("이미 등록되어 있습니다. home으로 돌아갑니다.");
      navigate("/");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(add(input));
    setInput("");
    alert(`${input}이름으로 작성되었습니다. 이제 채팅이 가능합니다.`);
    navigate("/");
    return;
  };

  return (
    <Layout.Body>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
      </form>
    </Layout.Body>
  );
}

export default Regist;
