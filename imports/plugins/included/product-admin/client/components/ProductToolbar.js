import React from "react";
import { useHistory } from "react-router-dom";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar";
import PublishControls from "/imports/plugins/core/catalog/client/containers/publishContainer";
import useProduct from "../hooks/useProduct";

/**
 * ProductHeader layout component
 * @returns {Node} React node
 */
function ProductToolbar() {
  const { product } = useProduct();
  const history = useHistory();

  if (!product) {
    return null;
  }

  return (
    <PrimaryAppBar
      title={"Products"}
      onBackButtonClick={() => {
        history.push("/products");
      }}
    >
      <PublishControls
        documents={[product]}
        documentIds={[product._id]}
      />
    </PrimaryAppBar>
  );
}

export default ProductToolbar;
