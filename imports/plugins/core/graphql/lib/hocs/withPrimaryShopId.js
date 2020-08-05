import React from "react";
import useCurrentShopId from "../../../../../client/ui/hooks/useCurrentShopId";

/**
 * @summary withPrimaryShopId HOC wrapper
 * @deprecated Function components should use `useCurrentShopId` hook directly
 * @param {React.Component} Component React component
 * @return {Function} HOC
 */
function withPrimaryShopId(Component) {
  /**
   * @summary WithPrimaryShopId HOC
   * @deprecated Function components should use `useCurrentShopId` hook directly
   * @param {Object} props React props
   * @return {Object} Rendered component instance
   */
  function WithPrimaryShopId(props) {
    const [shopId] = useCurrentShopId();

    return (
      <Component {...props} shopId={shopId} />
    );
  }

  return WithPrimaryShopId;
}

export default withPrimaryShopId;
