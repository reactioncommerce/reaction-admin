import React from "react";
import i18next from "i18next";
import { useSnackbar } from "notistack";
import { Components } from "@reactioncommerce/reaction-components";
import Logger from "/client/modules/logger";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import GeneralTaxSettings from "../components/GeneralTaxSettings";
import useTaxServices from "../hooks/useTaxServices";
import useTaxSettings from "../hooks/useTaxSettings";
import useUpdateTaxSettings from "../hooks/useUpdateTaxSettings";

/**
 * @summary Wraps the GeneralTaxSettings component to do Apollo queries and provide data binding
 * @return {React.Node} React node
 */
export default function GeneralTaxSettingsContainer() {
  const [shopId] = useCurrentShopId();

  const {
    defaultTaxCode,
    fallbackTaxServiceName,
    isLoadingTaxSettings,
    primaryTaxServiceName
  } = useTaxSettings(shopId);

  const {
    isLoadingTaxServices,
    taxServices
  } = useTaxServices(shopId);

  const { enqueueSnackbar } = useSnackbar();

  const { updateTaxSettings } = useUpdateTaxSettings(shopId, {
    onCompleted() {
      enqueueSnackbar(i18next.t("admin.settings.settingsSaveSuccess"), { variant: "success" });
    },
    onError(error) {
      Logger.error(error);
      enqueueSnackbar(i18next.t("admin.settings.settingsSaveFailure"), { variant: "warning" });
    }
  });

  if (!shopId || isLoadingTaxSettings || isLoadingTaxServices) {
    return <Components.Loading />;
  }

  const settingsDoc = {
    defaultTaxCode,
    fallbackTaxServiceName,
    primaryTaxServiceName
  };

  return (
    <GeneralTaxSettings
      onSubmit={updateTaxSettings}
      settingsDoc={settingsDoc}
      taxServices={taxServices}
    />
  );
}
