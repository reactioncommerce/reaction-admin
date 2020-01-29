import i18next from "i18next";

/**
 * Get a translations string for a given key
 * @param {String} key - A translation key
 * @param {Object} variables - Variables in the translation
 * @returns {String} A relative Url to the product's detail page
 */
export default function getTranslation(key, variables) {
  let translationKey = key;
  const { count } = variables;
  if (count && count.length > 1) {
    translationKey = `${translationKey}_plural`;
  }

  return i18next.t(translationKey, variables);
}
