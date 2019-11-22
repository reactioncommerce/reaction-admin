import saveSettings from "./saveSettings";

/**
 * @file Methods for sending emails, retrying failed emails and verifying email configuration.
 * Run these methods using `Meteor.call()`
 *
 * @namespace Email/Methods
*/

export default {
  "email/saveSettings": saveSettings
};
