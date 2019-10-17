import { useState, useEffect } from "react";
import { Tracker } from "meteor/tracker";
import { Reaction } from "/client/api";

/**
 * React Hook that gets the globally current shop ID
 * @return {Array} [currentShopId]
 */
export default function useCurrentInternalShopId() {
  const [currentShopId, setCurrentShopId] = useState(null);

  useEffect(() => {
    Tracker.autorun(() => {
      const shop = Reaction.getCurrentShop();
      setCurrentShopId((shop && shop._id) || null);
    });
  });

  return [currentShopId];
}
