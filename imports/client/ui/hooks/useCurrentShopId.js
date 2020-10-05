import { matchPath } from "react-router";
import { useLocation } from "react-router-dom";

/**
 * React Hook that gets the globally current shop ID from the `:shopId` URL prefix param
 * @return {Array} [currentShopId]
 */
export default function useCurrentShopId() {
  const location = useLocation();

  if (!location || !location.pathname) {
    return [];
  }

  const route = matchPath(location.pathname, {
    path: "/:shopId/",
    exact: false
  });

  if (!route) {
    return [];
  }

  const { shopId } = route.params;

  if (shopId === "new-shop") {
    return [];
  }

  return [shopId];
}
