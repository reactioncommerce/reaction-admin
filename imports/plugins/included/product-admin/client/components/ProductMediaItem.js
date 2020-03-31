import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  TableCell,
  TableRow,
  makeStyles
} from "@material-ui/core";
import { isInteger } from "lodash";
import CloseIcon from "mdi-material-ui/Close";
import { Meteor } from "meteor/meteor";
import TextField from "@reactioncommerce/catalyst/TextField";

const { filesBaseUrl } = Meteor.settings.public;

const useStyles = makeStyles(() => ({
  root: {
    position: "relative"
  },
  image: {
    height: 100
  },
  priorityField: {
    width: 70
  }
}));

/**
 * ProductMediaItem
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function ProductMediaItem(props) {
  const {
    defaultSource,
    onRemoveMedia,
    onSetMediaPriority,
    size,
    source
  } = props;

  const classes = useStyles();
  const [priority, setPriority] = useState(source.priority);

  let imageSrc = source.URLs[size];

  // If there is no img src, then render nothing
  if (imageSrc === String(null)) return null;

  if (imageSrc) {
    imageSrc = `${filesBaseUrl}${imageSrc}`;
  } else {
    imageSrc = defaultSource;
  }

  return (
    <TableRow>
      <TableCell className={classes.priorityField}>
        <TextField
          id="time"
          variant="outlined"
          type="numeric"
          value={priority === null ? "" : priority}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              onSetMediaPriority(source, priority);
            }
          }}
          onBlur={() => {
            onSetMediaPriority(source, priority);
          }}
          onChange={(event) => {
            setPriority(() => {
              const intValue = parseInt(event.target.value, 10);
              const newPriority = isInteger(intValue) ? intValue : null;
              return newPriority;
            });
          }}
        />
      </TableCell>
      <TableCell>
        <img
          alt=""
          className={classes.image}
          src={imageSrc}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton
          onClick={() => {
            onRemoveMedia(source);
          }}
        >
          <CloseIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

ProductMediaItem.propTypes = {
  defaultSource: PropTypes.string,
  editable: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  onRemoveMedia: PropTypes.func,
  onSetMediaPriority: PropTypes.func,
  size: PropTypes.string,
  source: PropTypes.object
};

ProductMediaItem.defaultProps = {
  defaultSource: "/resources/placeholder.gif",
  editable: false,
  onRemoveMedia() { },
  size: "large"
};

export default ProductMediaItem;
