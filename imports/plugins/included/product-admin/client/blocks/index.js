import React from "react";
import { registerBlock } from "../../../../core/components/lib";

import ProductHeader from "./ProductHeader";
import ProductDetailForm from "./ProductDetailForm";
import ProductMetadataForm from "./ProductMetadataForm";
import ProductSocialForm from "./ProductSocialForm";
import ProductTagForm from "./ProductTagForm";
import ProductMediaForm from "./ProductMediaForm";
import VariantHeader from "./VariantHeader";
import VariantList from "./VariantList";
import VariantDetailForm from "./VariantDetailForm";
import VariantPricesForm from "./VariantPricesForm";
import VariantTaxForm from "./VariantTaxForm";
import VariantMediaForm from "./VariantMediaForm";

// Register blocks

// ProductDetail Block: Sidebar
registerBlock({
  region: "ProductDetailSidebar",
  name: "VariantList",
  component: VariantList,
  priority: 10
});

// ProductDetail Block: Header
registerBlock({
  region: "ProductDetailHeader",
  name: "ProductHeader",
  // eslint-disable-next-line react/display-name
  component: (props) => <ProductHeader shouldDisplayStatus={true} {...props} />,
  priority: 10
});

// ProductDetail Block Region: Main
registerBlock({
  region: "ProductDetailMain",
  name: "ProductHeader",
  component: ProductHeader,
  priority: 10
});

registerBlock({
  region: "ProductDetailMain",
  name: "ProductDetailForm",
  component: ProductDetailForm,
  priority: 20
});

// Media gallery card and form
registerBlock({
  region: "ProductDetailMain",
  name: "ProductMediaForm",
  component: ProductMediaForm,
  priority: 30
});

registerBlock({
  region: "ProductDetailMain",
  name: "ProductSocialForm",
  component: ProductSocialForm,
  priority: 40
});

registerBlock({
  region: "ProductDetailMain",
  name: "ProductTagForm",
  component: ProductTagForm,
  priority: 50
});

registerBlock({
  region: "ProductDetailMain",
  name: "ProductMetadataForm",
  component: ProductMetadataForm,
  priority: 60
});

registerBlock({
  region: "VariantDetailSidebar",
  name: "VariantList",
  component: VariantList,
  priority: 70
});

// VariantDetail: Sidebar Region
registerBlock({
  region: "VariantDetailHeader",
  name: "ProductHeader",
  component: ProductHeader,
  priority: 10
});

// VariantDetail: Main Region
registerBlock({
  region: "VariantDetailMain",
  name: "VariantHeader",
  component: VariantHeader,
  priority: 10
});

registerBlock({
  region: "VariantDetailMain",
  name: "VariantDetailForm",
  component: VariantDetailForm,
  priority: 20
});

registerBlock({
  region: "VariantDetailMain",
  name: "VariantPricesForm",
  component: VariantPricesForm,
  priority: 30
});

registerBlock({
  region: "VariantDetailMain",
  name: "VariantMediaForm",
  component: VariantMediaForm,
  priority: 40
});

registerBlock({
  region: "VariantDetailMain",
  name: "VariantTaxForm",
  component: VariantTaxForm,
  priority: 50
});
