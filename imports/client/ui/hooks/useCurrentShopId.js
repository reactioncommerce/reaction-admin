import { useState, useEffect } from "react";
import Logger from "/client/modules/logger";
import getOpaqueIds from "/imports/plugins/core/core/client/util/getOpaqueIds";
import useCurrentInternalShopId from "./useCurrentInternalShopId.js";

/**
 * React Hook that gets the globally current shop ID
 * @return {Array} [currentShopId]
 */
export default function useCurrentShopId() {
  const [internalShopId] = useCurrentInternalShopId();
  const [currentShopId, setCurrentShopId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getOpaqueIds([
      { namespace: "Shop", id: internalShopId }
    ])
      .then(([opaqueShopId]) => {
        if (isMounted) setCurrentShopId(opaqueShopId);
        return null;
      })
      .catch((error) => {
        Logger.error(error);
      });

    return () => {
      isMounted = false;
    };
  }, [internalShopId]);

  return [currentShopId];
}
