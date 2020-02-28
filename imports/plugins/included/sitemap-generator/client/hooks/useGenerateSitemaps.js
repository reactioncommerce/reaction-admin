import { useCallback } from "react";
import { useMutation } from "react-apollo";
import { useSnackbar } from "notistack";
import i18next from "i18next";
import generateSitemapsMutation from "../mutations/generateSitemaps";

/**
 * useGenerateSitemaps
 * @param {String} shopId Shop ID
 * @param {Object} options Additional options
 * @returns {Function} An object containing a function to generate sitemaps
 */
export default function useGenerateSitemaps(shopId) {
  const [generateSitemaps] = useMutation(generateSitemapsMutation);
  const { enqueueSnackbar } = useSnackbar();

  const generate = useCallback(async () => {
    try {
      await generateSitemaps({
        variables: {
          input: {
            shopId
          }
        }
      });
      enqueueSnackbar(
        i18next.t("shopSettings.sitemapRefreshInitiated", {
          defaultValue: "Refreshing the sitemap can take up to 5 minutes. You will be notified when it is completed."
        }),
        { variant: "success" }
      );
    } catch (error) {
      enqueueSnackbar(
        i18next.t("shopSettings.sitemapRefreshInitiated", {
          defaultValue: "Refreshing the sitemap can take up to 5 minutes. You will be notified when it is completed."
        }),
        { variant: "success" }
      );
    }
  }, [
    enqueueSnackbar,
    generateSitemaps,
    shopId
  ]);

  return { generateSitemaps: generate };
}
