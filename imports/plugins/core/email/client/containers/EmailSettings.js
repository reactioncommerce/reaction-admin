import React, { Component, Fragment } from "react";
import { Blocks } from "@reactioncommerce/reaction-components";
import EmailLogs from "./emailLogs";

export default class EmailSettings extends Component {
  render() {
    return (
      <Fragment>
        <div>
          <Blocks region="EmailSettings" />
        </div>
        <div>
          <EmailLogs />
        </div>
      </Fragment>
    );
  }
}
