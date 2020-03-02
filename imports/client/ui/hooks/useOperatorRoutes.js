import { useMemo } from "react";
import { operatorRoutes } from "../index";

export const defaultRouteSort = (routeA, routeB) => (
  (routeA.priority || Number.MAX_SAFE_INTEGER) - (routeB.priority || Number.MAX_SAFE_INTEGER)
);

/**
 * Operator routes hook
 * @param {Object} options Options
 * @param {Object} [options.LayoutComponent] LayoutComponent override
 * @param {Object} [options.group] Filter routes by group name
 * @param {Object} [options.filter] Custom filter
 * @param {Object} [options.sort] Route sort function
 * @returns {Array} An array containing filtered routes
 */
export default function useOperatorRoutes(options = {}) {
  const {
    groups,
    filter,
    sort = defaultRouteSort
  } = options;

  const routes = useMemo(() => {
    let filteredRoutes;
    if (Array.isArray(groups)) {
      filteredRoutes = operatorRoutes.filter(({ group: routeGroup }) => groups.includes(routeGroup));
    } else if (filter) {
      filteredRoutes = operatorRoutes.filter(filter);
    } else {
      filteredRoutes = operatorRoutes;
    }

    if (sort) {
      filteredRoutes = filteredRoutes.sort(sort);
    }

    return filteredRoutes;
  }, [filter, groups, sort]);

  return routes;
}
