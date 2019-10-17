import { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { Reaction } from "/client/api";
import Logger from "/client/modules/logger";
import { storefrontHomeUrl as defaultStorefrontHomeUrl } from "/config";

/**
 * Hook to get user permissions for the App component
 * @return {Object} Permissions
 */
export default function useAuth() {
  const [isAdmin, setAdmin] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isLoggingOut, setLoggingOut] = useState(true);
  const [redirectUrl, setRedirect] = useState();

  useEffect(() => {
    Tracker.autorun(() => {
      const hasDashboardAccessForAnyShop = Reaction.hasDashboardAccessForAnyShop();
      const shop = Reaction.getCurrentShop();
      const storefrontHomeUrl = (shop && shop.storefrontUrls && shop.storefrontUrls.storefrontHomeUrl) || defaultStorefrontHomeUrl;
      const hasStorefrontHomeUrl = storefrontHomeUrl && storefrontHomeUrl.length;

      // Set is admin
      setAdmin(hasDashboardAccessForAnyShop);

      // Set whether the user is logged in or not. This with `!admin` can be used to determine if the
      // user is a customer
      setLoggedIn(!!Reaction.getUserId());

      // Attempt to check if we are still loading this data
      setLoading((hasDashboardAccessForAnyShop !== true && hasDashboardAccessForAnyShop !== false));

      if (!hasStorefrontHomeUrl && !isLoading) {
        Logger.warn("Missing storefront home URL. Please set this from the shop settings panel so that customer users can be redirected to your storefront.");
      }

      // Set the redirect for non-admins to go the the storefront
      if (isLoggedIn && !isAdmin && hasStorefrontHomeUrl && !isLoggingOut) {
        setRedirect(storefrontHomeUrl);
      } else {
        setRedirect(null);
      }
    });
  });

  const handleSignOut = () => {
    setLoggingOut(true);
    Meteor.logout((error) => {
      if (error) Logger.error(error);
      setLoggingOut(false);
    });
  };

  return {
    isAdmin,
    isLoggedIn,
    isLoading,
    redirectUrl,
    isLoggingOut,
    setLoggingOut,
    onSignOut: handleSignOut
  };
}
