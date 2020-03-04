/**
 * Get a url for a product's PDP page given a product object
 * @param {String} productId - A product id
 * @param {String} variantId - A variant or option id
 * @param {String} parentVariantId - A parent variant id of the second argument
 * @returns {String} A relative Url to the product's detail page
 */
export default function getPDPUrl(productId, variantId, parentVariantId) {
  if (variantId && parentVariantId) {
    // Option
    return `/products/${productId}/${parentVariantId}/${variantId}`;
  }

  // Variant
  if (variantId) {
    return `/products/${productId}/${variantId}`;
  }

  return `/products/${productId}`;
}
