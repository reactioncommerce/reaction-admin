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
import DotsHorizontalCircleIcon from "mdi-material-ui/DotsHorizontalCircle";
import useProduct from "../hooks/useProduct";
import getPDPUrl from "../utils/getPDPUrl";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(6)
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
    if (Array.isArray(variants)) {
      return variants.map((variant) => (
        <>
          <ListItem
            dense
            component="nav"
            className={parent ? classes.nested : undefined}
            button
            onClick={() => {
              const url = getPDPUrl(product._id, variant._id, parent && parent._id);
              history.push(url);

              if (!parent) {
                setExpandedIds((prevState) => {
                  const isOpen = expandedIds.includes(variant._id);

                  if (isOpen) {
                    return prevState.filter((id) => id !== variant._id);
                  }

                  return [...prevState, variant._id];
                });
              }
            }}
          >
            <ListItemText
              primary={variant.optionTitle || variant.title || "Untitled"}
              secondary={getItemSecondaryLabel(variant)}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  // show menu
                }}
              >
                <DotsHorizontalCircleIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {Array.isArray(variant.options) &&
            <Collapse
              in={expandedIds.includes(variant._id)}
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
      ));
    }

    return null;
  }, [classes.nested, expandedIds, product, history]);

  return (
    <Card>
      <CardHeader title={"Variants"} />
      <List>
        {product && Array.isArray(product.variants) && renderVariantTree(product.variants)}
      </List>
    </Card>
  );
}
