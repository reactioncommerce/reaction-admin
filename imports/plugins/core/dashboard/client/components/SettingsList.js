import React from "react";
import i18next from "i18next";
import {
  List,
  ListItemText,
  makeStyles,
  ListItem
} from "@material-ui/core";
import clsx from "classnames";
import { NavLink } from "react-router-dom";
import useOperatorRoutes from "imports/client/ui/hooks/useOperatorRoutes";

const activeClassName = "settings-active-item";

const useStyles = makeStyles((theme) => ({
  listItemRoot: {
    paddingLeft: theme.spacing(4),
    paddingTop: "unset",
    paddingBottom: "unset"
  },
  listItemTextRoot: {
    "paddingTop": theme.spacing(1),
    "paddingBottom": theme.spacing(1),
    "paddingLeft": theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.colors.darkBlue100,
      borderRadius: 3
    }
  },
  link: {
    [`&.${activeClassName} span`]: {
      color: theme.palette.colors.coolGrey500,
      fontWeight: theme.typography.fontWeightSemiBold
    }
  },
  linkBackground: {
    [`&.${activeClassName} div`]: {
      backgroundColor: theme.palette.colors.darkBlue100,
      borderRadius: 3
    }
  }
}));

/**
 * @summary A list settings for a shop
 * @returns {Node} React node
 */
export default function SettingsList() {
  const classes = useStyles();
  const settingsRoutes = useOperatorRoutes({ groups: ["settings"] });
  let settingsList = [];

  if (Array.isArray(settingsRoutes)) {
    settingsList = settingsRoutes.map((setting) => (
      <NavLink
        activeClassName={activeClassName}
        className={clsx({ [classes.link]: true, [classes.linkBackground]: true })}
        to={setting.path}
        key={setting.path}
      >
        <ListItem
          component="nav"
          ContainerProps={{
            className: classes.listItemContainer
          }}
          button={false}
          ContainerComponent={({ children, ...props }) => (
            <li {...props}>
              {i18next.t(setting.sidebarI18nLabel) }
              {children}
            </li>
          )}
          classes={{ root: classes.listItemRoot }}
        >
          <ListItemText
            classes={{ root: classes.listItemTextRoot }}
            primary={i18next.t(setting.sidebarI18nLabel)}
          />
        </ListItem>
      </NavLink>
    ));
  }

  return (
    <List>
      {settingsRoutes && Array.isArray(settingsRoutes) && settingsList}
    </List>
  );
}
