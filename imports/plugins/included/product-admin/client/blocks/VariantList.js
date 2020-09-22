import React, { Fragment, useCallback, useState, useEffect } from "react";
import {
  Collapse,
  List,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles,
  ListItem
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import clsx from "classnames";
import i18next from "i18next";
import useProduct from "../hooks/useProduct";
import getPDPUrl from "../utils/getPDPUrl";
import VariantItemAction from "../components/VariantItemAction";
import VariantListItemContainer from "../components/VariantListItemContainer";

const useStyles = makeStyles((theme) => ({
  listItemContainer: {
    "&:hover $listItemAction": {
      display: "block"
    },
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  listItem: {
    "&$selected $listItemPrimaryText, &$selected:hover $listItemPrimaryText": {
      fontWeight: theme.typography.fontWeightBold
    },
    [theme.breakpoints.up("xs")]: {
      paddingLeft: theme.spacing(8)
    },
    [theme.breakpoints.up("md")]: {
      "paddingLeft": theme.spacing(7),
      "&$selected": {
        backgroundColor: "transparent"
      },
      "&$selected:hover": {
        backgroundColor: "white"
      }
    }
  },
  listItemButton: {
    "transition": theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest
    }),
    "&:hover": {
      "textDecoration": "none",
      "backgroundColor": "white",
      "boxShadow": theme.shadows[2],
      "borderRadius": theme.shape.borderRadius,
      "@media (hover: none)": {
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: 0
      }
    }
  },
  nested: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(6)
    },
    [theme.breakpoints.up("xs")]: {
      paddingLeft: theme.spacing(4)
    }
  },
  listItemAction: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  /* Pseudo-class applied to the `component`'s `focusVisibleClassName` prop if `button={true}`. */
  focusVisible: {},
  /* Pseudo-class applied to the `ListItemText`'s `primary label` when `selected`. */
  listItemPrimaryText: {},
  /* Pseudo-class applied to the root element if `selected={true}`. */
  selected: {}
}));

/**
 * Get the secondary label for the product item
 * @param {Object} item A product, variant or option
 * @returns {String} A text label with status and price
 */
function getItemSecondaryLabel({ isVisible }) {
  const visibility = i18next.t(isVisible ? "app.visible" : "app.hidden");

  return `${visibility}`;
}

/**
 * Variant and Option list component
 * @summary A list component for variant and option depending on passed in props
 * @param {Object} props Component props
 * @returns {Node} React node
 */
export default function VariantList() {
  const {
    currentVariant,
    onArchiveProductVariants,
    onCreateVariant,
    onToggleVariantVisibility,
    onCloneProductVariants,
    onRestoreProduct,
    product,
    variant: variantProp
  } = useProduct();
  const classes = useStyles();
  const history = useHistory();
  const [expandedIds, setExpandedIds] = useState([]);


  useEffect(() => {
    if (variantProp) {
      setExpandedIds((prevState) => [...prevState, variantProp._id]);
    }
  }, [
    variantProp
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
        const hasChildren = Array.isArray(variant.options) && variant.options.length > 0;

        return (
          <Fragment key={`listItem-${variant._id}`}>
            <ListItem
              component="nav"
              ContainerProps={{
                className: clsx({
                  [classes.listItemContainer]: true,
                  [classes.nested]: Boolean(parentVariant)
                }),
                isExpanded,
                hasChildren,
                onArrowButtonClick: () => toggleExpand(variant._id)
              }}
              ContainerComponent={VariantListItemContainer}
              classes={{
                root: classes.listItem,
                button: classes.listItemButton,
                selected: classes.selected
              }}
              className={clsx({
                // [classes.nested]: Boolean(parentVariant)
              })}
              button
              selected={currentVariant && (currentVariant._id === variant._id)}
              onClick={() => {
                const url = getPDPUrl({
                  productId: product._id,
                  variantId: variant._id,
                  parentVariantId: parentVariant && parentVariant._id,
                  shopId: product.shop._id
                });
                history.push(url);

                if (!parentVariant) {
                  toggleExpand(variant._id);
                }
              }}
            >
              <ListItemText
                primaryTypographyProps={{
                  className: classes.listItemPrimaryText
                }}
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
    classes,
    currentVariant,
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
