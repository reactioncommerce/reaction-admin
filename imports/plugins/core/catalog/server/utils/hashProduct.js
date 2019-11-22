import hash from "object-hash";
import getTopLevelProduct from "./getTopLevelProduct.js";

const productFieldsThatNeedPublishing = [
  "_id",
  "description",
  "facebookMsg",
  "googleplusMsg",
  "handle",
  "hashtags",
  "isDeleted",
  "isVisible",
  "media",
  "metaDescription",
  "metafields",
  "originCountry",
  "pageTitle",
  "parcel",
  "pinterestMsg",
  "productType",
  "shopId",
  "supportedFulfillmentTypes",
  "template",
  "title",
  "twitterMsg",
  "type",
  "vendor"
];

const variantFieldsThatNeedPublishing = [
  "_id",
  "attributeLabel",
  "barcode",
  "compareAtPrice",
  "height",
  "index",
  "isDeleted",
  "isVisible",
  "length",
  "metafields",
  "minOrderQuantity",
  "optionTitle",
  "originCountry",
  "shopId",
  "sku",
  "title",
  "type",
  "weight",
  "width"
];

/**
 * @method createProductHash
 * @summary Create a hash of a product to compare for updates
 * @memberof Catalog
 * @param {String} product - The Product document to hash. Expected to be a top-level product, not a variant
 * @param {Object} collections - Raw mongo collections
 * @returns {String} product hash
 */
export async function createProductHash(product, collections) {
  const { MediaRecords, Products } = collections;

  const variants = await Products.find({ ancestors: product._id, type: "variant" }).toArray();

  const productForHashing = {};
  productFieldsThatNeedPublishing.forEach((field) => {
    productForHashing[field] = product[field];
  });

  // Track changes to all related media, too
  const mediaArray = await MediaRecords.find(
    {
      "metadata.productId": product._id,
      "metadata.workflow": { $nin: ["archived", "unpublished"] }
    },
    {
      sort: { "metadata.priority": 1, "uploadedAt": 1 }
    }
  ).toArray();

  productForHashing.media = mediaArray
    .map((media) => {
      const { priority } = media.metadata || {};

      return {
        id: media._id,
        priority
      };
    })
    .sort((mediaA, mediaB) => mediaA.priority - mediaB.priority);

  // Track changes to all variants, too
  productForHashing.variants = variants.map((variant) => {
    const variantForHashing = {};
    variantFieldsThatNeedPublishing.forEach((field) => {
      variantForHashing[field] = variant[field];
    });
    return variantForHashing;
  });

  return hash(productForHashing);
}

/**
 * @method hashProduct
 * @summary Create a hash of a product to compare for updates
 * @memberof Catalog
 * @param {String} productId - A productId
 * @param {Object} collections - Raw mongo collections
 * @param {Boolean} isPublished - Is product published to catalog
 * @returns {Object} updated product if successful, original product if unsuccessful
 */
export default async function hashProduct(productId, collections, isPublished = true) {
  const { Products } = collections;

  const topLevelProduct = await getTopLevelProduct(productId, collections);
  if (!topLevelProduct) {
    throw new Error(`No top level product found for product with ID ${productId}`);
  }

  const productHash = await createProductHash(topLevelProduct, collections);

  // Insert/update product document with hash field
  const hashFields = {
    currentProductHash: productHash
  };

  if (isPublished) {
    hashFields.publishedProductHash = productHash;
  }

  const productUpdates = {
    ...hashFields,
    updatedAt: new Date()
  };
  const result = await Products.updateOne({ _id: topLevelProduct._id }, { $set: productUpdates });

  if (result && result.result && result.result.ok === 1) {
    return { ...topLevelProduct, ...productUpdates };
  }

  return null;
}
