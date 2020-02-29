import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router";
import Helmet from "react-helmet";
import i18next from "i18next";
import { UIContext } from "../context/UIContext";
import useMediaQuery from "../hooks/useMediaQuery";
import ContentViewStandardLayout from "./ContentViewStandardLayout";

/**
 * Operator routes
 * @param {Object} props ComponentProps
 * @returns {Object} An object containing filtered routes
 */
function OperatorRoutes({ LayoutComponent: LayoutComponentProp, routes }) {
  const isMobile = useMediaQuery("mobile");
  const uiContext = useContext(UIContext);

  return (
    <Switch>
      {routes.map((route) => {
        const LayoutComponent = LayoutComponentProp || route.LayoutComponent || ContentViewStandardLayout;

        return (
          <Route
            key={route.path}
            path={route.path}
            render={(routeProps) => {
              const title = i18next.t(route.sidebarI18nLabel, { defaultValue: "Reaction Admin" });

              return (
                <LayoutComponent
                  isLeadingDrawerOpen={!isMobile}
                  isTrailingDrawerOpen={uiContext.isDetailDrawerOpen && !isMobile}
                >
                  <Helmet title={title} />
                  <route.MainComponent uiState={this.state} {...routeProps} />
                </LayoutComponent>
              );
            }}
            {...route.props}
          />
        );
      })}
    </Switch>
  );
}

OperatorRoutes.propTypes = {
  LayoutComponent: PropTypes.element,
  routes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    props: PropTypes.object
  }))
};

export default OperatorRoutes;
