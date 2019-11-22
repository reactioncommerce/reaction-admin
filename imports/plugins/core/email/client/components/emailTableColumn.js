import React, { Component } from "react";
import PropTypes from "prop-types";
import { Components, withMoment } from "@reactioncommerce/reaction-components";

class EmailTableColumn extends Component {
  static propTypes = {
    data: PropTypes.object,
    moment: PropTypes.func,
    row: PropTypes.object
  }

  render() {
    const { row } = this.props;

    const renderColumn = row.column.id;

    if (renderColumn === "status") {
      if (row.value === "completed") {
        return (
          <span>
            <Components.Icon icon="fa fa-circle" className="valid" />
          </span>
        );
      }
      return (
        <span>
          <Components.Icon icon="fa fa-circle" className="error" />
        </span>
      );
    }
    if (renderColumn === "updated") {
      const { moment } = this.props;
      const createdDate = (moment && moment(row.value).format("LLL")) || row.value.toLocaleString();
      return (
        <span>{createdDate}</span>
      );
    }
    return (
      <span>{row.value}</span>
    );
  }
}

export default withMoment(EmailTableColumn);
