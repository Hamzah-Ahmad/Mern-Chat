/* eslint-disable */

import React from "react";
import Login from "./Login";
import Register from "./Register";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const AuthScreen = ({ history }) => {
  const [showBackdrop, setBackDrop] = React.useState(false);
  const mediaMatch = useMediaQuery("(min-width:760px)");

  return (
    <div style={mediaMatch ? style.container : style.mobileContainer}>
      <Backdrop style={style.backdrop} open={showBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Login
        history={history}
        mediaMatch={mediaMatch}
        setBackDrop={setBackDrop}
      />
      <Register
        history={history}
        mediaMatch={mediaMatch}
        setBackDrop={setBackDrop}
      />
    </div>
  );
};

const style = {
  backdrop: {
    zIndex: 1,
    color: "#fff",
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  mobileContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "100vh",
  },
};

export default AuthScreen;
