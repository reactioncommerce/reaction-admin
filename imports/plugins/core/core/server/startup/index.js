import Logger from "@reactioncommerce/logger";
import Reaction from "../Reaction";
import "./browser-policy";
import CollectionSecurity from "./collection-security";
import RateLimiters from "./rate-limits";

const { REACTION_METEOR_APP_COMMAND_START_TIME } = process.env;

/**
 * @summary Core startup function
 * @returns {undefined}
 */
export default function startup() {
  const startTime = Date.now();

  // This env may be set by the launch script, allowing us to time how long Meteor build/startup took.
  if (REACTION_METEOR_APP_COMMAND_START_TIME) {
    const elapsedMs = startTime - Number(REACTION_METEOR_APP_COMMAND_START_TIME);
    Logger.info(`Meteor startup finished: ${elapsedMs}ms (This is incorrect if this is a restart.)`);
  }

  CollectionSecurity();
  RateLimiters();

  const endTime = Date.now();
  Logger.info(`Reaction initialization finished: ${endTime - startTime}ms`);

  // Main purpose of this right now is to wait to start Meteor app tests
  Reaction.emitAppStartupComplete();
}
