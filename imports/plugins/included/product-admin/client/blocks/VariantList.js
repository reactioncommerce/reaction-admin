import React, { Fragment, useCallback, useState, useEffect } from "react";
import {
  Collapse,
  List,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles,
  ListItem,
  IconButton
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import clsx from "classnames";
import ChevronDown from "mdi-material-ui/ChevronDown";
import ChevronRight from "mdi-material-ui/ChevronRight";
import useProduct from "../hooks/useProduct";
import getPDPUrl from "../utils/getPDPUrl";
import VariantItemAction from "../components/VariantItemAction";

const useStyles = makeStyles((theme) => ({
  expandButton: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1
  },
  listItemContainer: {
    "&:hover $listItemAction": {
      display: "block"
    }
  },
  listItem: {
    paddingLeft: theme.spacing(6)
  },
  nested: {
    paddingLeft: theme.spacing(8)
  },
  listItemAction: {
    display: "none"
  }
}));

/**
 * Get the secondary label for the product item
 * @param {Object} item A product, variant or option
 * @returns {String} A text label with status and price
 */
function getItemSecondaryLabel({ isVisible, displayPrice }) {
  const visibility = isVisible ? "Visible" : "Hidden";

  return `${visibility} - ${displayPrice}`;
}

/**
 * Variant and Option list component
 * @summary A list component for variant and option depending on passed in props
 * @param {Object} props Component props
 * @returns {Node} React node
 */
export default function VariantList() {
  const {
    onArchiveProductVariants,
    onCreateVariant,
    onToggleVariantVisibility,
    onCloneProductVariants,
    onRestoreProduct,
    product,
    variant: currentVariant
  } = useProduct();
  const classes = useStyles();
  const history = useHistory();
  const [expandedIds, setExpandedIds] = useState([]);


  useEffect(() => {
    if (currentVariant) {
      setExpandedIds((prevState) => [...prevState, currentVariant._id]);
    }
  }, [
    currentVariant
  ]);

  const renderVariantTree = useCallback((variants, parentVariant) => {
    const toggleExpand = (itemId) => {
      setExpandedIds((prevState) => {
        const isOpen = expandedIds.includes(itemId);

        if (isOpen) {
          return prevState.filter((id) => id !== itemId);
        }

        return [...prevState, itemId];
      });
    };

    if (Array.isArray(variants)) {
      return variants.map((variant) => {
        const isExpanded = expandedIds.includes(variant._id);

        return (
          <Fragment key={`listItem-${variant._id}`}>
            <ListItem
              component="nav"
              ContainerProps={{
                className: classes.listItemContainer
              }}
              className={clsx({
                [classes.listItem]: true,
                [classes.nested]: Boolean(parentVariant)
              })}
              button
              onClick={() => {
                const url = getPDPUrl(product._id, variant._id, parentVariant && parentVariant._id);
                history.push(url);

                if (!parentVariant) {
                  toggleExpand(variant._id);
                }
              }}
            >
              {!parentVariant &&
                <IconButton
                  className={classes.expandButton}
                  onClick={() => toggleExpand(variant._id)}
                >
                  {isExpanded ? <ChevronDown /> : <ChevronRight />}
                </IconButton>
              }
              <ListItemText
                primary={variant.optionTitle || variant.title || "Untitled"}
                secondary={getItemSecondaryLabel(variant)}
              />
              <ListItemSecondaryAction className={classes.listItemAction}>
                <VariantItemAction
                  product={product}
                  variant={parentVariant || variant}
                  option={parentVariant && variant}
                  onArchiveProductVariants={onArchiveProductVariants}
                  onCreateVariant={onCreateVariant}
                  onToggleVariantVisibility={onToggleVariantVisibility}
                  onCloneProductVariants={onCloneProductVariants}
                  onRestoreProduct={onRestoreProduct}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {Array.isArray(variant.options) &&
              <Collapse
                in={isExpanded}
              >
                <List
                  component="div"
                  disablePadding
                >
                  {renderVariantTree(variant.options, variant)}
                </List>
              </Collapse>
            }
          </Fragment>
        );
      });
    }

    return null;
  }, [
    expandedIds,
    classes.listItem,
    classes.nested,
    classes.expandButton,
    product,
    onArchiveProductVariants,
    onCreateVariant,
    onToggleVariantVisibility,
    onCloneProductVariants,
    onRestoreProduct,
    history
  ]);

  return (
    <List>
      {product && Array.isArray(product.variants) && renderVariantTree(product.variants)}
    </List>
  );
}
