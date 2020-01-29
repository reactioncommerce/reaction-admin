import React from "react";
import PropTypes from "prop-types";

/**
 * @summary Custom React-Table cell to render a products published status
 * @param {Object} row - The current row being rendered by React-Table
 * @returns {React.Component} A React component
 */
export default function PublishedStatusCell({ row }) {
  if (row.original.publishedProductHash === row.original.currentProductHash) {
    return (
      <span>Published</span>
    );
  }
  return <span>Unpublished</span>;
}

PublishedStatusCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      currentProductHash: PropTypes.string,
      publishedProductHash: PropTypes.string
    })
  })
};
