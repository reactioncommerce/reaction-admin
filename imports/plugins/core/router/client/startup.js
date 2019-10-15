import { loadRegisteredBlocks, loadRegisteredComponents } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Router } from "../lib";
import { initBrowserRouter } from "./browserRouter";

Meteor.startup(() => {
  loadRegisteredBlocks();
  loadRegisteredComponents();

  // initialize client routing
  initBrowserRouter();

  // we need to sometimes force
  // router reload on login to get
  // the entire layout to rerender
  // we only do this when the routes table
  // has already been generated (existing user)
  Accounts.onLogin(() => {
    if (Meteor.loggingIn() === false && Router._routes.length > 0) {
      initBrowserRouter();
    }
  });
});
