import React from "react";
import RouterContext from "../context/RouterContext";

/**
 * @name useRouter
 * @summary Hook to get router context
 * @returns {Object} Router context
 */
export default function useRouter() {
  return React.useContext(RouterContext);
}
