/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}>
      {children}
    </div>
  );
}

Layout.Header = function LayoutHeader({ children }) {
  return <div>{children}</div>;
};

Layout.Body = function LayoutBody({ children }) {
  return (
    <div
      css={css`
        flex: 1;
      `}>
      {children}
    </div>
  );
};
Layout.Routes = function LayoutRoutes({ children }) {
  return (
    <div
      css={css`
        display: flex;
        gap: 15px;
      `}>
      {children}
    </div>
  );
};
Layout.Route = function LayoutRoute({ to, children }) {
  return <Link to={to}>{children}</Link>;
};

export default Layout;
