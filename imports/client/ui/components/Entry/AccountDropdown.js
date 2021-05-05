import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import AccountIcon from "mdi-material-ui/Account";
import Popover from "@material-ui/core/Popover";
import { i18next } from "/client/api";
import ViewerInfo from "@reactioncommerce/components/ViewerInfo/v1";
import Link from "@material-ui/core/Link";
import Modal from "@material-ui/core/Modal";
import getAccountsHandler from "../../../../../lib/accountsServer";
import Login from "./Login";
import SignUp from "./SignUp";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

/**
 * function to get query params passed to the current URL
 * @returns {Object} query params of the URL
 */
function useQuery() {
  return new URLSearchParams(useLocation().search); // eslint-disable-line node/no-unsupported-features/node-builtins
}

const useStyles = makeStyles((theme) => ({
  accountDropdown: {
    width: 320,
    padding: theme.spacing(2)
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  paper: {
    position: "absolute",
    width: 380,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const AccountDropdown = (props) => {
  const {
    viewer,
    refetchViewer
  } = props;
  const query = useQuery();
  const resetToken = query.get("resetToken");
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [anchorElement, setAnchorElement] = useState(null);
  const [modalValue, setModalValue] = useState("");
  const { accountsClient } = getAccountsHandler();
  const isAuthenticated = viewer && viewer._id;

  const onClose = () => {
    setAnchorElement(null);
  };

  useEffect(() => {
    if (!resetToken) return;
    setOpen(true);
    setModalValue("reset-password");
  }, [resetToken]);

  const openModal = (value) => {
    setModalValue(value);
    setOpen(true);
    onClose();
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    await accountsClient.logout();
    await refetchViewer();
    onClose();
  };

  const toggleOpen = (event) => {
    setAnchorElement(event.currentTarget);
  };

  const getModalComponent = () => {
    let comp = Login;
    if (modalValue === "signup") {
      comp = SignUp;
    } else if (modalValue === "change-password") {
      comp = ChangePassword;
    } else if (modalValue === "forgot-password") {
      comp = ForgotPassword;
    } else if (modalValue === "reset-password") {
      comp = ResetPassword;
    }
    return React.createElement(comp, { closeModal, openModal, resetToken, refetch: refetchViewer });
  };

  return (
    <Fragment>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="entry-modal"
        aria-describedby="entry-modal"
      >
        <div className={classes.paper}>
          { getModalComponent() }
        </div>
      </Modal>
      { isAuthenticated ?
        <ButtonBase onClick={toggleOpen}>
          <ViewerInfo viewer={viewer} />
        </ButtonBase>
        :
        <IconButton color="primary" onClick={toggleOpen}>
          <AccountIcon />
        </IconButton>
      }

      <Popover
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        open={Boolean(anchorElement)}
        onClose={onClose}
      >
        <div className={classes.accountDropdown}>
          {isAuthenticated ?
            <Fragment>
              <div className={classes.marginBottom}>
                <Link href="/profile">
                  <Button color="primary" fullWidth>
                    {i18next.t("admin.userAccountDropdown.profileLabel")}
                  </Button>
                </Link>
              </div>
              <div className={classes.marginBottom}>
                <Button color="primary" fullWidth onClick={() => openModal("change-password")}>
                  Change Password
                </Button>
              </div>
              <Button color="primary" fullWidth onClick={handleSignOut} variant="contained">
                Sign Out
              </Button>
            </Fragment>
            :
            <Fragment>
              <div className={classes.authContent}>
                <Button color="primary" fullWidth variant="contained" onClick={() => openModal("login")}>
                  Sign In
                </Button>
              </div>
              <Button color="primary" fullWidth onClick={() => openModal("signup")}>
                Create Account
              </Button>
            </Fragment>
          }
        </div>
      </Popover>
    </Fragment>
  );
};

AccountDropdown.propTypes = {
  refetchViewer: PropTypes.func,
  viewer: PropTypes.shape({
    _id: PropTypes.string
  })
};

export default AccountDropdown;
