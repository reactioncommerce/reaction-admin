import React from "react";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";

/**
 * @summary withOpaqueShopId HOC wrapper
 * @deprecated Function components should use `useCurrentShopId` hook directly
 * @param {React.Component} Component React component
 * @return {Function} HOC
 */
function withOpaqueShopId(Component) {
  /**
   * @summary WithOpaqueShopId HOC
   * @deprecated Function components should use `useCurrentShopId` hook directly
   * @param {Object} props React props
   * @return {Object} Rendered component instance
   */
  function WithOpaqueShopId(props) {
    const [shopId] = useCurrentShopId();

    return (
      <Component {...props} shopId={shopId} />
    );
  }

  return WithOpaqueShopId;
}

export default withOpaqueShopId;
