import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { getTaxSettingsQuery } from "./useTaxSettings.js";

const updateTaxShopSettingsMutation = gql`
  mutation updateTaxShopSettingsMutation($input: UpdateShopSettingsInput!) {
    updateShopSettings(input: $input) {
      shopSettings {
        defaultTaxCode
        fallbackTaxServiceName
        primaryTaxServiceName
      }
    }
  }
`;

/**
 * @summary React hook that returns a function for updating tax settings for a shop
 * @param {String} shopId Shop ID
 * @return {Object} Returns an object with `updateTaxSettings` fn
 */
export default function useUpdateTaxSettings(shopId, {
  onCompleted,
  onError
}) {
  const [updateTaxSettings] = useMutation(updateTaxShopSettingsMutation, {
    ignoreResults: true,
    onCompleted,
    onError,
    update(cache, { data: { updateShopSettings } }) {
      if (updateShopSettings && updateShopSettings.shopSettings) {
        cache.writeQuery({
          query: getTaxSettingsQuery,
          variables: {
            shopId
          },
          data: {
            shopSettings: { ...updateShopSettings.shopSettings }
          }
        });
      }
    }
  });

  return {
    updateTaxSettings(settingsUpdates) {
      return updateTaxSettings({
        variables: {
          input: {
            settingsUpdates,
            shopId
          }
        }
      });
    }
  };
}
