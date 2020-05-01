import React from "react";
import classNames from "classnames";
import { Grid, Typography, makeStyles } from "@material-ui/core";
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
    transform: "rotate(180deg)",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center"
  }
}));

function GroupCardHeader({ children: title, expanded, onEdit, onExpandClick }) {
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
            [classes.expandOpen]: expanded,
          })}
          onClick={() => onExpandClick(!expanded)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ChevronDownIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default GroupCardHeader;
