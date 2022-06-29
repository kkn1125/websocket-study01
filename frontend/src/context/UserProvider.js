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
      return state;
    case CHECK:
      return localStorage["user"] || state;
    case REMOVE:
      return state;
    default:
      return state;
  }
};

export const DispathContext = createContext(() => {});
export const UserContext = createContext(null);

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(user, initialState);
  return (
    <DispathContext.Provider value={dispatch}>
      <UserContext.Provider value={state}>{children}</UserContext.Provider>
    </DispathContext.Provider>
  );
}

export default UserProvider;
