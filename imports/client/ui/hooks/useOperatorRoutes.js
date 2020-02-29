import { operatorRoutes } from "../index";

export const defaultRouteSort = (routeA, routeB) => (routeA.priority || Number.MAX_SAFE_INTEGER) - (routeB.priority || Number.MAX_SAFE_INTEGER);

/**
 * Operator routes hook
 * @param {Object} options Options
 * @param {Object} [options.LayoutComponent] LayoutComponent override
 * @param {Object} [options.group] Filter routes by group name
 * @param {Object} [options.filter] Custom filter
 * @param {Object} [options.sort] Route sort function
 * @returns {Array} An array containing filtered routes
 */
export default function useOperatorRoutes(options) {
  const {
    group,
    filter,
    sort = defaultRouteSort
  } = options;

  let routes = operatorRoutes;

  if (group) {
    routes = operatorRoutes.filter(({ group: routeGroup }) => routeGroup === group);
  } else if (filter) {
    routes = operatorRoutes.filter(filter);
  }

  if (sort) {
    routes = operatorRoutes.sort(sort);
  }

  return routes;
}

