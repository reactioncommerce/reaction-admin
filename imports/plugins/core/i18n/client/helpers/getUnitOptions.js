import i18next from "i18next";

/**
 *
 * @param {String} type  the type of unit, either length or measure
 * @param {Array} rawOptions - an array af of unformatted units
 * @returns {Array} An array of formatted options to be used in a select
 */
export default function getUnitOptions(type, rawOptions) {
  const options = [];
  if (Array.isArray(rawOptions)) {
    for (const option of rawOptions) {
      options.push({
        label: i18next.t(`admin.${type}.${option.label}`, { defaultValue: option.label }),
        value: option[type]
      });
    }
  }

  return options;
}
