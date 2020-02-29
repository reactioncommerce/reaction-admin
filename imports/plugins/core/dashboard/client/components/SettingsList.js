import React, { Fragment } from "react";
import i18next from "i18next";
import {
  List,
  ListItemText,
  makeStyles,
  ListItem
} from "@material-ui/core";
import clsx from "classnames";
import { useHistory } from "react-router-dom";
import { operatorRoutes } from "imports/client/ui/index";

// Route sorting by priority. Items without a priority get pushed the bottom.
const routeSort = (routeA, routeB) => (routeA.priority || Number.MAX_SAFE_INTEGER) - (routeB.priority || Number.MAX_SAFE_INTEGER);

const useStyles = makeStyles((theme) => ({
  listItemContainer: {
    "&:hover $listItemAction": {
      display: "block"
    }
  },
  listItem: {
    paddingLeft: theme.spacing(7)
  }
}));

/**
 * @summary A list settings for a shop
 * @param {Object} props Component props
 * @returns {Node} React node
 */
export default function SettingsList() {
  const classes = useStyles();
  const history = useHistory();
  const settingsRoutes = operatorRoutes.filter(({ isNavigationLink, isSetting }) => isNavigationLink && isSetting).sort(routeSort);
  let settingsList = [];

  if (Array.isArray(settingsRoutes)) {
    settingsList = settingsRoutes.map((setting) => (
      <Fragment key={`listItem-${setting.path}`}>
        <ListItem
          component="nav"
          ContainerProps={{
            className: classes.listItemContainer
          }}
          ContainerComponent={({ children, ...props }) => (
            <li {...props}>
              {i18next.t(setting.sidebarI18nLabel) }
              {children}
            </li>
          )}
          className={clsx({
            [classes.listItem]: true
          })}
          button
          onClick={() => history.push(setting.path)}
        >
          <ListItemText
            primary={i18next.t(setting.sidebarI18nLabel)}
          />
        </ListItem>
      </Fragment>
    ));
  }

  return (
    <List>
      {operatorRoutes && Array.isArray(operatorRoutes) && settingsList}
    </List>
  );
}
