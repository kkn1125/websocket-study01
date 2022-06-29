/** @jsxImportSource @emotion/react */
import { css } from "@emotion/css";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Layout({ children }) {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 35%;
        margin-left: auto;
        margin-right: auto;
      `}>
      {children}
    </div>
  );
}

Layout.Header = function LayoutHeader({ children }) {
  return (
    <div
      className={css`
        border-bottom-width: 1px;
        border-bottom-color: #454545;
        border-bottom-style: solid;
        margin-bottom: 1rem;
      `}>
      {children}
    </div>
  );
};

Layout.Body = function LayoutBody({ children }) {
  return (
    <div
      className={css`
        flex: 1;
      `}>
      {children}
    </div>
  );
};

Layout.Routes = function LayoutRoutes({ children }) {
  return (
    <div
      className={css`
        display: flex;
        gap: 15px;
        & a {
          text-decoration: none;
        }
      `}>
      {children}
    </div>
  );
};

Layout.Route = function LayoutRoute({ to, children }) {
  const locate = useLocation();
  return (
    <Link
      to={to}
      className={css`
        color: ${locate.pathname === to ? "#651595" : "#959595"};
        text-transform: uppercase;
      `}>
      {children}
    </Link>
  );
};

export default Layout;
