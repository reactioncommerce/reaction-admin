import { useCallback } from "react";
import { useMutation } from "react-apollo";
import generateSitemapsMutation from "../mutations/generateSitemaps";

/**
 * useGenerateSitemaps
 * @param {String} shopId Shop ID
 * @returns {Function} An object containing a function to generate sitemaps
 */
export default function useGenerateSitemaps(shopId) {
  const [generateSitemaps] = useMutation(generateSitemapsMutation);

  const generate = useCallback(async () => {
    await generateSitemaps({
      variables: {
        input: {
          shopId
        }
      }
    });
  }, [
    generateSitemaps,
    shopId
  ]);

  return { generateSitemaps: generate };
}
