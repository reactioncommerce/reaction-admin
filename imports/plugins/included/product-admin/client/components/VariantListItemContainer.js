/* eslint-disable prefer-arrow-callback */
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  makeStyles,
  IconButton
} from "@material-ui/core";
import ChevronDown from "mdi-material-ui/ChevronDown";
import ChevronRight from "mdi-material-ui/ChevronRight";

const useStyles = makeStyles((theme) => ({
  expandButton: {
    position: "absolute",
    left: theme.spacing(2),
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1
  }
}));

/**
 * Variant list item container
 * @summary A list component for variant and option depending on passed in props
 * @param {Object} props Component props
 * @returns {Node} React node
 */
const VariantListItemContainer = React.forwardRef(function VariantListItemContainer(props, ref) {
  const {
    children,
    hasChildren,
    isExpanded,
    onArrowButtonClick,
    ...otherProps
  } = props;
  const classes = useStyles();

  return (
    <li {...otherProps} ref={ref}>
      {hasChildren &&
        <Box className={classes.expandButton}>
          <IconButton onClick={onArrowButtonClick}>
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
          </IconButton>
        </Box>
      }
      {children}
    </li>
  );
});

VariantListItemContainer.propTypes = {
  children: PropTypes.node,
  hasChildren: PropTypes.bool,
  isExpanded: PropTypes.bool,
  onArrowButtonClick: PropTypes.func
};

export default VariantListItemContainer;
