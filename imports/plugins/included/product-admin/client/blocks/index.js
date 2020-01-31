import { registerBlock } from "../../../../core/components/lib";

import withVariantForm from "../hocs/withVariantForm";
import withProductForm from "../hocs/withProductForm";
import ProductHeader from "./ProductHeader";
import ProductDetailForm from "./ProductDetailForm";
import ProductMetadataForm from "./ProductMetadataForm";
import ProductSocialForm from "./ProductSocialForm";
import ProductTagForm from "./ProductTagForm";
import ProductMediaForm from "./ProductMediaForm";
import VariantHeader from "./VariantHeader";
import VariantTable from "./VariantTable";
import VariantList from "./VariantList";
import VariantDetailForm from "./VariantDetailForm";
import VariantTaxForm from "./VariantTaxForm";
import VariantMediaForm from "./VariantMediaForm";
import OptionTable from "./OptionTable";

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
  component: ProductHeader,
  priority: 10
});

// ProductDetail Block Region: Main
registerBlock({
  region: "ProductDetailMain",
  name: "ProductDetailForm",
  component: ProductDetailForm,
  priority: 10
});

// Media gallery card and form
// registerBlock({
//   region: "ProductDetailMain",
//   name: "ProductMediaForm",
//   component: ProductMediaForm,
//   priority: 20
// });

registerBlock({
  region: "ProductDetailMain",
  name: "ProductSocialForm",
  component: ProductSocialForm,
  priority: 30
});

registerBlock({
  region: "ProductDetailMain",
  name: "ProductTagForm",
  component: ProductTagForm,
  priority: 40
});

// registerBlock({
//   region: "ProductDetailMain",
//   name: "ProductMetadataForm",
//   component: ProductMetadataForm,
//   hocs: [withProductForm],
//   priority: 50
// });

registerBlock({
  region: "VariantDetailSidebar",
  name: "VariantList",
  component: VariantList,
  priority: 10
});

// Header
registerBlock({
  region: "VariantDetailHeader",
  name: "ProductHeader",
  component: ProductHeader,
  priority: 10
});

registerBlock({
  region: "VariantDetailMain",
  name: "VariantDetailForm",
  component: VariantDetailForm,
  priority: 10
});

// registerBlock({
//   region: "VariantDetailMain",
//   name: "VariantMediaForm",
//   component: VariantMediaForm,
//   priority: 20
// });

// registerBlock({
//   region: "VariantDetailMain",
//   name: "VariantTaxForm",
//   component: VariantTaxForm,
//   hocs: [withVariantForm],
//   priority: 30
// });
