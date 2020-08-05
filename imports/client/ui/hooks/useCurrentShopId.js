import { matchPath } from "react-router";
import { useLocation } from "react-router-dom";

/**
 * React Hook that gets the globally current shop ID from the `:shopId` URL prefix param
 * @return {Array} [currentShopId]
 */
export default function useCurrentShopId() {
  const location = useLocation();

  const { params } = matchPath(location.pathname, {
    path: "/:shopId/",
    exact: false
  });

  const { shopId } = params;

  return [shopId];
}
