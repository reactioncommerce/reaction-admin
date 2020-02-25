import React from "react";
import Helmet from "react-helmet";
import i18next from "i18next";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core";
import useProduct from "../hooks/useProduct";
import VariantItemAction from "../components/VariantItemAction";

/**
 * Header component for various product admin forms
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function VariantHeader() {
  const {
    currentVariant,
    onArchiveProductVariants,
    onCloneProductVariants,
    onToggleVariantVisibility,
    product,
    variant,
    option
  } = useProduct();

  if (!currentVariant) {
    return null;
  }

  const defaultTitle = option ? "Untitled Option" : "Untitled Variant";

  return (
    <Box paddingTop={2} paddingBottom={2}>
      <Box display="flex" alignItems="center">
        <Box flex="1">
          <Typography variant="h2">
            <Helmet title={product.title} />
            {currentVariant.title || defaultTitle}
            {(currentVariant.isDeleted) && `(${i18next.t("app.archived")})`}
          </Typography>
        </Box>
        <VariantItemAction
          product={product}
          variant={variant}
          option={option}
          onArchiveProductVariants={onArchiveProductVariants}
          onToggleVariantVisibility={onToggleVariantVisibility}
          onCloneProductVariants={onCloneProductVariants}
        />
      </Box>
    </Box>
  );
}

export default VariantHeader;
