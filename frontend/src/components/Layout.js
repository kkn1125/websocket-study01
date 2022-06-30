import { ClassNames, css } from "@emotion/react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Layout({ children }) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 35%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1rem;
      `}>
      {children}
    </div>
  );
}

Layout.Header = function LayoutHeader({ children }) {
  return (
    <div
      css={css`
        border-bottom-width: 1px;
        border-bottom-color: #454545;
        border-bottom-style: solid;
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
      `}>
      {children}
    </div>
  );
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
    <ClassNames>
      {({ css, cx }) => (
        <Link
          to={to}
          className={cx(
            css`
              color: ${locate.pathname === to ? "#651595" : "#959595"};
              text-transform: uppercase;
            `,
            css`
              border: 1px solid #22aaaa;
              border-radius: 5px;
              background-color: #22aaaaa5;
              color: white;
              padding: 0.3rem 0.5rem;
            `
          )}>
          {children}
        </Link>
      )}
    </ClassNames>
  );
};

export default Layout;
