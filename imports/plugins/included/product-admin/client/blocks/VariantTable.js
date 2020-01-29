import React from "react";
import VariantTableComponent from "../components/VariantTable";
import useProduct from "../hooks/useProduct";

/**
 * Variant table block component
 * @param {Object} props Component props
 * @returns {Node} React node
 */
function VariantTable() {
  const {
    onCreateVariant,
    onUpdateProduct,
    product
  } = useProduct();

  if (!product) return null;

  return (
    <VariantTableComponent
      title="Variants"
      items={product.variants}
      onCreate={() => { onCreateVariant(); }}
      onChangeField={(item, field, value) => {
        onUpdateProduct({
          product: {
            [field]: value
          }
        });
      }}
    />
  );
}

export default VariantTable;
