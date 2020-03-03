import { getReactComponentOrBlazeTemplate } from "/imports/plugins/core/components/lib/ReactComponentOrBlazeTemplate";
import { compose, setDisplayName } from "recompose";
import "./startup";
import "./appComponents";

export const operatorRoutes = [];
export const routes = [];
export const defaultRouteGroups = {
  navigation: "navigation",
  settings: "settings"
};

/**
 * @name registerOperatorRoute
 * @summary Registers new route in the operator UI.
 * @param {Object} route - The route
 * @param {String} route.path - The URL path for this route
 * @param {Node|String} route.mainComponent - A react component to render in
 * the main content area or the name of a Blaze template that has been registered
 * by a package.
 * @param {Node} route.SidebarIconComponent - A React component that renders the menu icon for this route
 * @param {String} route.sidebarI18nLabel - The i18n key for this route, i.e. "admin.dashboard.ordersLabel"
 * @returns {undefined}
 */
export function registerOperatorRoute(route) {
  const { isNavigationLink, isSetting, layoutComponent, mainComponent, MainComponent, hocs = [] } = route;
  const additionalProps = {};

  if (isNavigationLink) {
    // eslint-disable-next-line no-console
    console.warn("Option `isNavigationLink` is deprecated. Set `group: \"main\"` in your route configuration");
    additionalProps.group = defaultRouteGroups.main;
  }

  if (isSetting) {
    // eslint-disable-next-line no-console
    console.warn("Option `isSetting` is deprecated. Set `group: \"settings\"` in your route configuration");
    additionalProps.group = defaultRouteGroups.settings;
  }

  if (layoutComponent) {
    // eslint-disable-next-line no-console
    console.warn("Option `layoutComponent` is deprecated. Use `LayoutComponent` instead");
    additionalProps.LayoutComponent = layoutComponent;
  }

  if (mainComponent) {
    // eslint-disable-next-line no-console
    console.warn("Option `mainComponent` is deprecated. Use `MainComponent` instead");
  }

  const resolvedMainComponent = MainComponent || mainComponent;
  let component;

  if (typeof resolvedMainComponent === "string") {
    component = () => getReactComponentOrBlazeTemplate(resolvedMainComponent);
  } else {
    component = resolvedMainComponent;
  }

  component = compose(...hocs, setDisplayName(`Reaction(${name})`))(component);

  operatorRoutes.push({
    ...route,
    ...additionalProps,
    MainComponent: component
  });
}

/**
 * @name registerRoute
 * @summary Registers new route public route
 * @param {Object} route - The route
 * @param {String} route.path - The URL path for this route
 * @param {Node|String} route.mainComponent - A react component to render in
 * the main content area or the name of a Blaze template that has been registered
 * by a package.
 * @param {Node} route.SidebarIconComponent - A React component that renders the menu icon for this route
 * @param {String} route.sidebarI18nLabel - The i18n key for this route, i.e. "admin.dashboard.ordersLabel"
 * @returns {undefined}
 */
export function registerRoute(route) {
  const { mainComponent, hocs = [] } = route;
  let component = mainComponent;

  if (typeof mainComponent === "string") {
    component = () => getReactComponentOrBlazeTemplate(mainComponent);
  }

  component = compose(...hocs, setDisplayName(`Reaction(${name})`))(component);

  routes.push({
    exact: true,
    ...route,
    MainComponent: component
  });
}
