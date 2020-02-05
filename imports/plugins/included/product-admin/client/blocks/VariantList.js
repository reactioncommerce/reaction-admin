import React, { useCallback, useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Collapse,
  List,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles,
  ListItem,
  IconButton
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
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
  listItem: {
    paddingLeft: theme.spacing(6)
  },
  nested: {
    paddingLeft: theme.spacing(8)
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
    onArchiveProduct,
    onToggleVariantVisibility,
    onCloneProduct,
    onRestoreProduct,
    product,
    variant: currentVariant,
    option: currentOption,
    shopId
  } = useProduct();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [expandedIds, setExpandedIds] = useState([]);


  useEffect(() => {
    if (currentVariant) {
      setExpandedIds((prevState) => [...prevState, currentVariant._id]);
    }
  }, [
    currentVariant
  ]);

  const renderVariantTree = useCallback((variants, parent) => {
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
          <>
            <ListItem
              dense
              component="nav"
              className={clsx({
                [classes.listItem]: true,
                [classes.nested]: Boolean(parent)
              })}
              button
              onClick={() => {
                const url = getPDPUrl(product._id, variant._id, parent && parent._id);
                history.push(url);

                if (!parent) {
                  toggleExpand(variant._id);
                }
              }}
            >
              {!parent &&
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
              <ListItemSecondaryAction>
                <VariantItemAction
                  product={product}
                  variant={currentVariant}
                  option={currentOption}
                  onArchiveProduct={onArchiveProduct}
                  onToggleVariantVisibility={onToggleVariantVisibility}
                  onCloneProduct={onCloneProduct}
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
                  marginDense
                  disablePadding
                >
                  {renderVariantTree(variant.options, variant)}
                </List>
              </Collapse>
            }
          </>
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
    currentVariant,
    currentOption,
    onArchiveProduct,
    onToggleVariantVisibility,
    onCloneProduct,
    onRestoreProduct,
    history
  ]);

  return (
    <Card>
      <CardHeader title={"Variants"} />
      <List>
        {product && Array.isArray(product.variants) && renderVariantTree(product.variants)}
      </List>
    </Card>
  );
}
