import React from "react";
import { Blocks } from "@reactioncommerce/reaction-components";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";

/**
 * ShopSettings
 */
export default function ShopSettings() {
  const [currentShopId] = useCurrentShopId();

  return (
    <div>
    Shop settings
      {currentShopId &&
        <Blocks region="ShopSettings" blockProps={{ shopId: currentShopId }}/>
      }
    </div>
  );
}
