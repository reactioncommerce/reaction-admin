import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircleIcon from "mdi-material-ui/CheckboxBlankCircle";
import i18next from "i18next";

const useStyles = makeStyles((theme) => ({
  isVisible: {
    color: theme.palette.colors.forestGreen300,
    fontSize: theme.typography.fontSize * 1.25,
    marginRight: theme.spacing(1)
  },
  isHidden: {
    color: theme.palette.colors.black40,
    fontSize: theme.typography.fontSize * 1.25,
    marginRight: theme.spacing(1)
  }
}));

/**
 * @summary Custom React-Table cell to render a products published status
 * @param {Object} row - The current row being rendered by React-Table
 * @returns {React.Component} A React component
 */
export default function StatusIconCell({ row }) {
  const classes = useStyles();

  if (row.original.isVisible) {
    return (
      <div style={{ display: "flex" }}>
        <CircleIcon className={classes.isVisible} />
        <span>{i18next.t("admin.tags.visible")}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <CircleIcon className={classes.isHidden} />
      <span>{i18next.t("admin.tags.hidden")}</span>
    </div>
  );
}

StatusIconCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      isVisible: PropTypes.boolean
    })
  })
};
