import { getReactComponentOrBlazeTemplate } from "/imports/plugins/core/components/lib/ReactComponentOrBlazeTemplate";
import { compose, setDisplayName } from "recompose";
import "./startup";
import "./appComponents";

export const operatorRoutes = [];
export const routes = [];

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
  const { mainComponent, hocs = [] } = route;
  let component = mainComponent;

  if (typeof mainComponent === "string") {
    component = () => getReactComponentOrBlazeTemplate(mainComponent);
  }

  component = compose(...hocs, setDisplayName(`Reaction(${name})`))(component);

  operatorRoutes.push({ ...route, mainComponent: component });
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
    mainComponent: component
  });
}
