import React, { createContext, useReducer } from "react";

const ADD = "user/ADD";
const CHECK = "user/CHECK";
const REMOVE = "user/REMOVE";

const initialState = null;

export const add = (user) => ({ type: ADD, user });
export const check = () => ({ type: CHECK });
export const remove = () => ({ type: REMOVE });

const user = (state, action) => {
  switch (action.type) {
    case ADD:
      localStorage["user"] = action.user;
      return action.user;
    case CHECK:
      if (localStorage["user"] === undefined) {
        localStorage["user"] = "";
      }
      return localStorage["user"];
    case REMOVE:
      localStorage.removeItem("user");
      return null;
    default:
      return state;
  }
};

export const DispatchContext = createContext(() => {});
export const UserContext = createContext(null);

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(user, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <UserContext.Provider value={state}>{children}</UserContext.Provider>
    </DispatchContext.Provider>
  );
}

export default UserProvider;
