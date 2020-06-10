import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Grid, makeStyles } from "@material-ui/core";
import ChevronDownIcon from "mdi-material-ui/ChevronDown";
import PencilIcon from "mdi-material-ui/Pencil";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  expand: {
    float: "right",
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  titleContainer: {
    display: "flex",
    alignItems: "center"
  }
}));

/**
 * @summary Renders the group card header
 * @name GroupCardHeader
 * @param {Object} props - the component's props
 * @param {String} props.children - the group's title component
 * @param {Boolean} props.isExpanded - whether the group card should be expanded
 * @param {Function} props.onEdit - called back when clicking the edit button
 * @param {Function} props.onExpandClick - called back when clicking the expand button
 * @returns {React.Component} - the GroupCardHeader component
 */
function GroupCardHeader({ children: title, isExpanded, onEdit, onExpandClick }) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item sm={11} className={classes.titleContainer}>
        <IconButton onClick={onEdit}>
          <PencilIcon />
        </IconButton>
        {title}
      </Grid>
      <Grid item sm={1}>
        <IconButton
          className={classNames({
            [classes.expand]: true,
            [classes.expandOpen]: isExpanded
          })}
          onClick={() => onExpandClick(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label="show more"
        >
          <ChevronDownIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

GroupCardHeader.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  isExpanded: PropTypes.bool,
  onEdit: PropTypes.func,
  onExpandClick: PropTypes.func
};

export default GroupCardHeader;
