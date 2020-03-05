import React from "react";
import i18next from "i18next";
import {
  List,
  ListItemText,
  makeStyles,
  ListItem
} from "@material-ui/core";
import clsx from "classnames";
import { useHistory } from "react-router-dom";
import useOperatorRoutes from "imports/client/ui/hooks/useOperatorRoutes";

const useStyles = makeStyles((theme) => ({
  listItemContainer: {
    "&:hover $listItemAction": {
      display: "block"
    }
  },
  listItem: {
    paddingLeft: theme.spacing(4)
  }
}));

/**
 * @summary A list settings for a shop
 * @returns {Node} React node
 */
export default function SettingsList() {
  const classes = useStyles();
  const history = useHistory();
  const settingsRoutes = useOperatorRoutes({ groups: ["settings"] });
  let settingsList = [];

  if (Array.isArray(settingsRoutes)) {
    settingsList = settingsRoutes.map((setting) => (
      <ListItem
        key={`listItem-${setting.path}`}
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
    ));
  }

  return (
    <List>
      {settingsRoutes && Array.isArray(settingsRoutes) && settingsList}
    </List>
  );
}
