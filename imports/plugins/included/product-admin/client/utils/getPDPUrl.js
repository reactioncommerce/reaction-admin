/**
 * Get a url for a product's PDP page given a product object
 * @param {Object} args - the method's arguments
 * @param {String} args.productId - A product id
 * @param {String} args.variantId - A variant or option id
 * @param {String} args.parentVariantId - A parent variant id of the second argument
 * @param {String} args.shopId - A shop ID
 * @returns {String} A relative Url to the product's detail page
 */
export default function getPDPUrl({ productId, variantId, parentVariantId, shopId }) {
  let url = `/${shopId}/`;

  if (variantId && parentVariantId) {
    // Option
    url = `${url}products/${productId}/${parentVariantId}/${variantId}`;
  } else if (variantId) {
    // Variant
    url = `${url}products/${productId}/${variantId}`;
  } else {
    url = `${url}products/${productId}`;
  }

  return url;
}
