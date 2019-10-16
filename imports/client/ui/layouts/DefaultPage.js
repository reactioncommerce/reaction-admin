import React from "react";

import { Button, makeStyles } from "@material-ui/core";
import useAuth from "../hooks/useAuth";
import { Components } from "@reactioncommerce/reaction-components";
import ShopLogo from "/imports/client/ui/components/ShopLogoWithData/ShopLogoWithData";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh"
  },
  content: {
    width: "100%",
    maxWidth: 480
  },
  logo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(3)
  },
  logoutButton: {
    textAlign: "center"
  }
}));

/**
 * Displays a not-found or login
 * @returns {React.ReactElement} React component
 */
function DefaultPage() {
  const { isAdmin, isLoggedIn, onSignOut } = useAuth();
  const classes = useStyles();

  let content = <Components.Login />;

  if (isLoggedIn && !isAdmin) {
    content = (
      <div className={classes.logoutButton}>
        <Button
          color="primary"
          onClick={onSignOut}
          variant="contained"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div id="reactionAppContainer">
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.logo}>
            <ShopLogo linkTo="/" size={200} />
          </div>
          {content}
        </div>
      </div>
    </div>
  );
}

export default DefaultPage;
