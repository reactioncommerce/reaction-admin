import { useMediaQuery as useMediaQueryMui } from "@material-ui/core";

/**
 * Media query hook. Wraps the mui hook `useMediaQuery` with some additional options.
 * @param {String} breakpoint Breakpoint name. `mobile|tablet|desktop|xs|sm|md|lg`
 * @param {Options} options Options
 * @returns {Boolean} Whether the breakpoint is active
 */
export default function useMediaQuery(breakpoint = "mobile", options) {
  return useMediaQueryMui((theme) => {
    if (breakpoint === "mobile") {
      return theme.breakpoints.down("sm", options);
    } else if (breakpoint === "tablet") {
      return theme.breakpoints.down("md", options);
    } else if (breakpoint === "desktop") {
      return theme.breakpoints.up("md", options);
    }
    return theme.breakpoints.up(breakpoint, options);
  });
}
