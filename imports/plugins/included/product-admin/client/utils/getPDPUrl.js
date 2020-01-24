import decodeOpaqueId from "/imports/utils/decodeOpaqueId.js";

/**
 * Get a url for a product's PDP page given a product object
 * @param {Object} product - A product
 * @returns {String} A relative Url to the product's detail page
 */
export default function getPDPUrl(product) {
  let variantId = "";
  const { id: productId } = decodeOpaqueId(product._id);
  // check for variant existence
  if (product.variants && product.variants.length) {
    ({ id: variantId } = decodeOpaqueId(product.variants[0]._id));
  }

  return `/products/${productId}/${variantId}`;
}
