import React from "react";
import ProductHeaderComponent from "../components/ProductHeader";
import useProduct from "../hooks/useProduct";

/**
 * Product header block component
 * @returns {Node} React node
 */
function ProductHeader() {
  const {
    onArchiveProduct,
    onCloneProduct,
    onToggleProductVisibility,
    product
  } = useProduct();

  return (
    <ProductHeaderComponent
      product={product}
      onArchiveProduct={onArchiveProduct}
      onCloneProduct={onCloneProduct}
      onVisibilityChange={onToggleProductVisibility}
    />
  );
}

export default ProductHeader;
