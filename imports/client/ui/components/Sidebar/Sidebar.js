import React from "react";
import { compose, withState } from "recompose";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Fab from "@material-ui/core/Fab";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import withStyles from "@material-ui/core/styles/withStyles";
import CloseIcon from "mdi-material-ui/Close";
import { Translation } from "/imports/plugins/core/ui/client/components";
import useIsAppLoading from "/imports/client/ui/hooks/useIsAppLoading.js";
import useCurrentShopId from "../../hooks/useCurrentShopId";
import ShopLogoWithData from "../ShopLogoWithData";
import useOperatorRoutes from "../../hooks/useOperatorRoutes";

const activeClassName = "nav-item-active";

const styles = (theme) => ({
  closeButton: {
    "color": theme.palette.colors.white,
    "backgroundColor": theme.palette.colors.darkBlue500,
    "&:hover": {
      "backgroundColor": theme.palette.colors.darkBlue600,
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: theme.palette.colors.darkBlue500
      }
    }
  },
  icon: {
    minWidth: 32,
    display: "flex",
    justifyContent: "center",
    marginRight: theme.spacing(2),
    color: theme.palette.colors.coolGrey300
  },
  iconActive: {
    color: theme.palette.text.active
  },
  shopLogo: {
    flex: 1,
    marginRight: theme.spacing(2)
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  listItem: {
    "paddingLeft": theme.spacing(2),
    "paddingRight": theme.spacing(2),
    "&:hover": {
      backgroundColor: theme.palette.colors.darkBlue600,
      transition: `background-color ${theme.transitions.duration.shortest} ${theme.transitions.easing.easeInOut}`
    }
  },
  listItemText: {
    paddingLeft: 0,
    fontSize: theme.typography.fontSize,
    lineHeight: 1.5,
    letterSpacing: 0.5,
    color: theme.palette.colors.black15
  },
  listItemNested: {
    "paddingTop": 0,
    "paddingBottom": 0,
    "paddingLeft": theme.spacing(8),
    "&:hover": {
      backgroundColor: theme.palette.colors.darkBlue600,
      transition: `background-color ${theme.transitions.duration.shortest} ${theme.transitions.easing.easeInOut}`
    }
  },
  link: {
    [`&.${activeClassName} span`]: {
      color: theme.palette.text.secondaryActive,
      fontWeight: theme.typography.fontWeightSemiBold
    },
    [`&.${activeClassName} $icon`]: {
      color: theme.palette.text.active
    }
  }
});

/**
 * Main sidebar navigation
 * @param {Object} props Component props
 * @returns {React.Component} Sidebar component
 */
function Sidebar(props) {
  const {
    classes,
    isMobile,
    isSidebarOpen,
    onDrawerClose,
    setIsSettingsOpen
  } = props;

  const [isAppLoading] = useIsAppLoading();
  const [currentShopId] = useCurrentShopId();
  const primaryRoutes = useOperatorRoutes({ groups: ["navigation"] });

  let drawerProps = {
    classes: {
      paper: classes.drawerPaper
    },
    open: true,
    variant: "persistent"
  };

  if (isMobile) {
    drawerProps = {
      variant: "temporary",
      anchor: "left",
      open: isSidebarOpen,
      onClose: onDrawerClose,
      ModalProps: {
        keepMounted: true // Better open performance on mobile.
      }
    };
  }

  let list;
  if (!isAppLoading && currentShopId) {
    list = (
      <List disablePadding>
        {primaryRoutes.map((route) => (
          <NavLink
            activeClassName={activeClassName}
            className={classes.link}
            to={route.href || route.path}
            key={route.path}
            onClick={() => {
              setIsSettingsOpen(false);
              onDrawerClose();
            }}
          >
            <ListItem button className={classes.listItem}>
              <ListItemIcon className={classes.icon}>
                {route.SidebarIconComponent && <route.SidebarIconComponent />}
              </ListItemIcon>
              <ListItemText
                disableTypography
                className={classes.listItemText}
              >
                <Translation defaultValue="" i18nKey={route.sidebarI18nLabel} />
              </ListItemText>
            </ListItem>
          </NavLink>
        ))}
      </List>
    );
  }

  return (
    <Drawer {...drawerProps}>
      <AppBar
        color="secondary"
        elevation={0}
        position="sticky"
      >
        <Toolbar className={classes.toolbar}>
          <ShopLogoWithData className={classes.shopLogo} shouldShowShopName size={32} />

          <Hidden mdUp>
            <Fab classes={{ root: classes.closeButton }} onClick={onDrawerClose} size="small">
              <CloseIcon />
            </Fab>
          </Hidden>

        </Toolbar>
      </AppBar>
      {list}
    </Drawer>
  );
}

Sidebar.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  isMobile: PropTypes.bool,
  isSidebarOpen: PropTypes.bool.isRequired,
  onDrawerClose: PropTypes.func.isRequired,
  setIsSettingsOpen: PropTypes.func.isRequired
};

Sidebar.defaultProps = {
  setIsSidebarOpen() {}
};

export default compose(
  withRouter,
  withStyles(styles, { name: "RuiSidebar" }),
  withState("isSettingsOpen", "setIsSettingsOpen", false)
)(Sidebar);
