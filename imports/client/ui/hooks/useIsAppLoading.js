import { useState, useEffect } from "react";
import { Tracker } from "meteor/tracker";
import { Subscriptions } from "/client/modules/core/subscriptions.js";

/**
 * @summary React Hook used to determine if core app requirements
 *   like translations are still loading
 * @return {Array} [isAppLoading]
 */
export default function useIsAppLoading() {
  const [isAppLoading, setIsAppLoading] = useState(null);

  useEffect(() => {
    Tracker.autorun(() => {
      const allSubscriptionsReady = (
        Subscriptions.BrandAssets.ready() &&
        Subscriptions.Groups.ready() &&
        Subscriptions.MyAccount.ready() &&
        Subscriptions.PrimaryShop.ready()
      );

      setIsAppLoading(!allSubscriptionsReady);
    });
  });

  return [isAppLoading];
}
