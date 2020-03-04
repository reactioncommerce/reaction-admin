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
  const thumbnailUrl = row.original && row.original.media && row.original.media[0]
    && row.original.media[0].URLs && row.original.media[0].URLs.thumbnail;

  if (!thumbnailUrl) {
    return (
      <img
        src={"/resources/placeholder.gif"}
        alt={row.values.title}
        width="36"
      />
    );
  }

  return (
    <img
      src={`${filesBaseUrl}${thumbnailUrl}`}
      alt={row.values.title}
      width="36"
    />
  );
}

MediaCell.propTypes = {
  row: PropTypes.object
};
