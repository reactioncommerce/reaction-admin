import React from "react";
import {
  Card,
  CardContent,
  CardHeader
} from "@material-ui/core";
import i18next from "i18next";
import useCurrentShop from "/imports/client/ui/hooks/useCurrentShop.js";
import DefaultParcelSizeForm from "./DefaultParcelSizeForm.js";

/**
 * @summary Renders shipping page
 * @return {React.Node} React node
 */
export default function Shipping() {
  const { refetchShop, shop } = useCurrentShop();

  if (!shop) return null;

  return (
    <Card>
      <CardHeader
        title={i18next.t("defaultParcelSize.label")}
      />
      <CardContent>
        <DefaultParcelSizeForm
          doc={shop.defaultParcelSize}
          onSuccess={refetchShop}
          shopId={shop._id}
        />
      </CardContent>
    </Card>
  );
}
