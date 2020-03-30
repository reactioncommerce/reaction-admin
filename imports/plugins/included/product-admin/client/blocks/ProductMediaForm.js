import React from "react";
import { i18next } from "/client/api";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import ProductMediaGallery from "../components/ProductMediaGallery";
import useProduct from "../hooks/useProduct";

/**
 * Product media form block component
 * @param {Object} props Component props
 * @returns {React.Component} React component
 */
function ProductMediaForm() {
  const { product, shopId } = useProduct();

  if (!product) {
    return null;
  }

  return (
    <Card>
      <CardHeader title={i18next.t("admin.productAdmin.mediaGallery")} />
      <CardContent>
        <ProductMediaGallery
          editable={true}
          media={product.media}
          productId={product._id}
          shopId={shopId}
        />
      </CardContent>
    </Card>
  );
}

export default ProductMediaForm;
