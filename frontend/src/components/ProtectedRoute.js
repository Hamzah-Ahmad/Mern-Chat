import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useContext(AuthContext);
  // console.log(isLoggedIn);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoggedIn) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/auth",
                state: {
                  msg: "Please sign in to perform this action",
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
