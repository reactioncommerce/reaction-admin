import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";

const { filesBaseUrl } = Meteor.settings.public;

/**
 * @summary Custom React-Table cell to render a product's thumbnail image.
 * @param {Object} row - The current row being rendered by React-Table
 * @returns {React.Component} A React component
 */
export default function MediaCell({ row }) {
  return (
    <img
      src={`${filesBaseUrl}${row.original.media[0].URLs.thumbnail}`}
      alt={row.values.title}
      width="50"
    />
  );
}

MediaCell.propTypes = {
  row: PropTypes.object
};
