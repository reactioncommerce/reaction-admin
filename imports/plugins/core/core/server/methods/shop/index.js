import createTag from "./createTag";
import updateBrandAssets from "./updateBrandAssets";
import updateCurrencyConfiguration from "./updateCurrencyConfiguration";
import updateDefaultParcelSize from "./updateDefaultParcelSize";
import updateHeaderTags from "./updateHeaderTags";
import updateLanguageConfiguration from "./updateLanguageConfiguration";

/**
 * @file Meteor methods for Shop
 *
 *
 * @namespace Shop/Methods
*/

export default {
  "shop/createTag": createTag,
  "shop/updateBrandAssets": updateBrandAssets,
  "shop/updateCurrencyConfiguration": updateCurrencyConfiguration,
  "shop/updateDefaultParcelSize": updateDefaultParcelSize,
  "shop/updateHeaderTags": updateHeaderTags,
  "shop/updateLanguageConfiguration": updateLanguageConfiguration
};
