import { compose } from "recompose";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import EmailLogs from "../components/emailLogs";
import { Jobs } from "/lib/collections";

const composer = (props, onData) => {
  if (Meteor.subscribe("Emails").ready()) {
    const emails = Jobs.find().fetch();
    onData(null, { emails });
  }
};

export default compose(composeWithTracker(composer))(EmailLogs);
