/* eslint-disable node/no-missing-require, node/no-unpublished-require */
import Logger from "@reactioncommerce/logger";
import { Meteor } from "meteor/meteor";
import { lifecycle } from "recompose";
import { composeWithTracker } from "./composer";

let i18next;
let Reaction;

if (Meteor.isClient) {
  ({ i18next, Reaction } = require("/client/api"));
} else {
  Reaction = require("/imports/plugins/core/core/server/Reaction").default;
}


/**
 * @name withCurrentUser
 * @method
 * @summary A wrapper to reactively inject the current user into a component
 * @param {Function|React.Component} component - the component to wrap
 * @returns {Function} the new wrapped component with a "currentUser" prop
 * @memberof Components/Helpers
 */
export function withCurrentUser(component) {
  return composeWithTracker((props, onData) => {
    onData(null, { currentUser: Meteor.user() });
  })(component);
}


/**
 * @name withMoment
 * @method
 * @summary A wrapper to reactively inject the moment package into a component
 * @param {Function|React.Component} component - the component to wrap
 * @returns {Function} the new wrapped component with a "moment" prop
 * @memberof Components/Helpers
 */
export function withMoment(component) {
  return lifecycle({
    componentDidMount() {
      import("moment")
        .then(({ default: moment }) => {
          moment.locale(i18next.language);
          this.setState({ moment });
          return null;
        })
        .catch((error) => {
          Logger.debug(error, "moment.js async import error");
        });
    }
  })(component);
}


/**
 * @name withMomentTimezone
 * @method
 * @summary A wrapper to reactively inject the moment package into a component
 * @param {Function|React.Component} component - the component to wrap
 * @returns {Function} the new wrapped component with a "moment" prop
 * @memberof Components/Helpers
 */
export function withMomentTimezone(component) {
  return lifecycle({
    componentDidMount() {
      import("moment-timezone")
        .then(({ default: moment }) => {
          this.setState({ momentTimezone: moment.tz });
          return null;
        })
        .catch((error) => {
          Logger.debug(error, "moment.js async import error");
        });
    }
  })(component);
}

/**
 * @name withIsAdmin
 * @method
 * @summary A wrapper to reactively inject the current user's admin status.
 * Sets a boolean 'isAdmin' prop on the wrapped component.
 * @param {Function|React.Component} component - the component to wrap
 * @returns {Function} the new wrapped component with an "isAdmin" prop
 * @memberof Components/Helpers
 */
export function withIsAdmin(component) {
  return composeWithTracker((props, onData) => {
    onData(null, { isAdmin: Reaction.hasAdminAccess() });
  })(component);
}

/**
 * @name withCSSTransition
 * @method
 * @summary A wrapper to dynamically import & inject react-transition-group's <CSSTransition /> into a component
 * @param {Function|React.Component} component - the component to wrap
 * @returns {Object} the new wrapped component with a "CSSTransition" prop
 * @memberof Components/Helpers
 */
export function withCSSTransition(component) {
  return lifecycle({
    componentDidMount() {
      import("react-transition-group")
        .then((module) => {
          if (this.willUnmount === true) {
            return null;
          }

          this.setState({
            CSSTransition: module.CSSTransition
          });

          return null;
        })
        .catch((error) => {
          Logger.error(error.message, "Unable to load react-transition-group");
        });
    },
    componentWillUnmount() {
      // Prevent dynamic import from setting state if component is about to unmount
      this.willUnmount = true;
    }
  })(component);
}

/**
 * @name withAnimateHeight
 * @method
 * @summary A wrapper that reactively injects an extended version of react-animate-height's <AnimateHeight />
 *  into a component.
 * @param {Function|React.Component} component - the component to wrap
 * @returns {Function} the new wrapped component with a "AnimateHeight" prop
 * @memberof Components/Helpers
 */
export function withAnimateHeight(component) {
  return lifecycle({
    componentDidMount() {
      import("react-animate-height")
        .then((module) => {
          if (this.willUnmount) {
            return null;
          }

          // Extend AnimateHeight so that setState can't be called when component is unmounted (prevents memory leak)
          const AnimateHeight = module.default;
          class ExtendedAnimateHeight extends AnimateHeight {
            componentWillUnmount() {
              this.willUnmount = true;
              super.componentWillUnmount();
            }

            setState(partialState, callback) {
              if (this.willUnmount) {
                return;
              }
              super.setState(partialState, callback);
            }
          }

          // Pass extended AnimateHeight to child component
          this.setState({
            AnimateHeight: ExtendedAnimateHeight
          });

          return null;
        })
        .catch((error) => {
          Logger.error(error.message, "Unable to load react-animate-height");
        });
    },
    componentWillUnmount() {
      // Prevent dynamic import from setting state if component is about to unmount
      this.willUnmount = true;
    }
  })(component);
}
