import React from "react";
import { StyleRoot } from "radium";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Reaction } from "/client/api";
import { AdminContextProvider } from "/imports/plugins/core/ui/client/providers";

/**
 * @description function to handle back button on action view
 * @returns {undefined}
 */
function handleActionViewBack() {
  Reaction.popActionView();
}

/**
 * @description function to handle back button on action view detail
 * @returns {undefined}
 */
function handleActionViewDetailBack() {
  Reaction.popActionViewDetail();
}

/**
 * @description function to handle close button on action view
 * @returns {undefined}
 */
function handleActionViewClose() {
  Reaction.hideActionView();
}

/**
 * @description function to handle close button on action view detail
 * @returns {undefined}
 */
function handleActionViewDetailClose() {
  Reaction.hideActionViewDetail();
}

/**
 * @summary Composer
 * @param {Object} props Provided props
 * @param {Function} onData Call this with props
 * @returns {undefined}
 */
function composer(props, onData) {
  const items = [];

  items.push({
    icon: "plus",
    tooltip: "Create Content",
    i18nKeyTooltip: "app.createContent",
    tooltipPosition: "left middle"
  });

  // calculated here and not in component, as environment dependent.
  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  onData(null, {
    isAdminArea: true,
    actionView: Reaction.getActionView(),
    detailView: Reaction.getActionViewDetail(),
    data: props.data,
    buttons: items,
    isActionViewAtRootView: Reaction.isActionViewAtRootView(),
    isDetailViewAtRootView: Reaction.isActionViewDetailAtRootView(),
    actionViewIsOpen: Reaction.isActionViewOpen(),
    detailViewIsOpen: Reaction.isActionViewDetailOpen(),
    viewportWidth,

    // Callbacks
    handleActionViewBack,
    handleActionViewDetailBack,
    handleActionViewClose,
    handleActionViewDetailClose
  });
}

/**
 * @name ActionViewContainer
 * @param {React.Component} Comp wrapped component
 * @returns {React.Component} returns a React component
 */
export default function ActionViewContainer(Comp) {
  /**
   * @name CompositeComponent
   * @param {Object} props Component props
   * @returns {React.Component} Wrapped Toolbar component
   */
  function CompositeComponent(props) {
    return (
      <AdminContextProvider>
        <StyleRoot>
          <Comp {...props} />
        </StyleRoot>
      </AdminContextProvider>
    );
  }

  return composeWithTracker(composer)(CompositeComponent);
}
