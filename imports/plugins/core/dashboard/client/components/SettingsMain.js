import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Blocks, Components } from "@reactioncommerce/reaction-components";
import i18next from "i18next";
import { Switch, Route } from "react-router-dom";
import {
  Box,
  Container,
  makeStyles
} from "@material-ui/core";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar";
import { operatorRoutes } from "imports/client/ui/index";

// Route sorting by priority. Items without a priority get pushed the bottom.
const routeSort = (routeA, routeB) => (routeA.priority || Number.MAX_SAFE_INTEGER) - (routeB.priority || Number.MAX_SAFE_INTEGER);

const useStyles = makeStyles((theme) => ({
  block: {
    marginBottom: theme.spacing(3)
  },
  sidebar: {
    flex: "1 1 auto",
    maxWidth: 330,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflowY: "auto",
    borderRight: `1px solid ${theme.palette.divider}`
  },
  content: {
    flex: "1 1 auto",
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflowY: "auto",
    paddingTop: theme.spacing(5)
  }
}));

/**
 * @name ShopSettings
 * @param {Object} props Component props
 * @returns {React.component} a functional React component
 */
export default function SettingsMain(props) {
  const { blockProps } = props;
  const [currentShopId] = useCurrentShopId();
  const classes = useStyles();
  const settingsRoutes = operatorRoutes.filter(({ isNavigationLink, isSetting }) => isNavigationLink && isSetting).sort(routeSort);

  if (!currentShopId) return <Components.Loading />;

  return (
    <Fragment>
      <PrimaryAppBar title={i18next.t("admin.settings.settingsLabel")} />
      <Box display="flex" textAlign="left">
        <div className={classes.sidebar}>
          <Box padding={2}>
            <Blocks region="SettingsSidebar" blockProps={blockProps} />
          </Box>
        </div>
        <div className={classes.content}>
          <Container maxWidth="md">
            <Switch>
              {
                settingsRoutes.map((settingRoute) => (
                  <Route
                    key={settingRoute.path}
                    component={settingRoute.mainComponent}
                    path={settingRoute.path}
                  />
                ))
              }
            </Switch>
          </Container>
        </div>
      </Box>
    </Fragment>
  );
}

SettingsMain.propTypes = {
  blockProps: PropTypes.object
};
