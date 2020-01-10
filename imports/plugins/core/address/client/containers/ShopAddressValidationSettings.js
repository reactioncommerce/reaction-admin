import React from "react";
import { Components } from "@reactioncommerce/reaction-components";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId.js";
import ShopAddressValidationSettings from "../components/ShopAddressValidationSettings.js";
import useAddressValidationRules from "../hooks/useAddressValidationRules.js";
import useAddressValidationServices from "../hooks/useAddressValidationServices.js";

/**
 * @summary React component that wraps ShopAddressValidationSettings to bind data
 * @return {React.Node} React node
 */
export default function ShopAddressValidationSettingsContainer() {
  const {
    addressValidationServices,
    isLoadingAddressValidationServices
  } = useAddressValidationServices();

  const [shopId] = useCurrentShopId();

  const {
    addressValidationRules,
    fetchAddressValidationRules,
    isLoadingAddressValidationRules,
    refetchAddressValidationRules,
    totalAddressValidationRulesCount
  } = useAddressValidationRules(shopId);

  if (!shopId || isLoadingAddressValidationServices) {
    return <Components.Loading />;
  }

  return (
    <ShopAddressValidationSettings
      addressValidationRules={addressValidationRules}
      addressValidationServices={addressValidationServices}
      fetchAddressValidationRules={fetchAddressValidationRules}
      isLoadingAddressValidationRules={isLoadingAddressValidationRules}
      refetchAddressValidationRules={refetchAddressValidationRules}
      shopId={shopId}
      totalAddressValidationRulesCount={totalAddressValidationRulesCount}
    />
  );
}
