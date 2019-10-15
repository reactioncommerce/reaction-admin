import React, { Component } from "react";
import { compose } from "recompose";
import CountryOptions from "@reactioncommerce/api-utils/CountryOptions.js";
import CurrencyOptions from "@reactioncommerce/api-utils/CurrencyOptions.js";
import LanguageDefinitions from "@reactioncommerce/api-utils/LanguageDefinitions.js";
import { registerComponent, composeWithTracker, withMomentTimezone } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Reaction, i18next } from "/client/api";
import { Shops } from "/lib/collections";
import { convertWeight, convertLength } from "/lib/api";
import LocalizationSettings from "../components/localizationSettings";

const languages = [];
for (const language of LanguageDefinitions) {
  const i18nKey = `languages.${language.label.toLowerCase()}`;
  languages.push({
    label: language.label,
    value: language.i18n,
    i18nKey
  });
}

/**
 * @summary Use this as a Meteor.call callback to show a toast alert
 *   with the error reason/message.
 * @param {Error|null} [error] Error
 * @return {undefined}
 */
function methodAlertCallback(error) {
  if (error) Alerts.toast(error.reason || error.message || "There was an unknown error", "error");
}

const wrapComponent = (Comp) => (
  class LocalizationSettingsContainer extends Component {
    static propTypes = LocalizationSettings.propTypes

    handleUpdateLanguageConfiguration = (event, isChecked, name, callback) => {
      const language = this.props.languages.find((lang) => lang.value === name);

      if (language) {
        Meteor.call("shop/updateLanguageConfiguration", language.value, isChecked, (error) => {
          methodAlertCallback(error);
          if (callback) callback(error);
        });
      }
    }

    handleUpdateCurrencyConfiguration = (event, isChecked, name, callback) => {
      Meteor.call("shop/updateCurrencyConfiguration", name, isChecked, (error) => {
        methodAlertCallback(error);
        if (callback) callback(error);
      });
    }

    handleSubmit = (doc) => {
      const shop = Shops.findOne({
        _id: Reaction.getShopId()
      }, { defaultParcelSize: 1, baseUOM: 1, baseUOL: 1 });
      if (shop && shop.defaultParcelSize) {
        const parcelSize = {
          weight: convertWeight(shop.baseUOM, doc.baseUOM, shop.defaultParcelSize.weight),
          height: convertLength(shop.baseUOL, doc.baseUOL, shop.defaultParcelSize.height),
          length: convertLength(shop.baseUOL, doc.baseUOL, shop.defaultParcelSize.length),
          width: convertLength(shop.baseUOL, doc.baseUOL, shop.defaultParcelSize.width)
        };
        Meteor.call("shop/updateDefaultParcelSize", parcelSize, methodAlertCallback);
      }
      Shops.update({
        _id: doc._id
      }, {
        $set: {
          timezone: doc.timezone,
          currency: doc.currency,
          baseUOM: doc.baseUOM,
          baseUOL: doc.baseUOL,
          language: doc.language,
          allowCustomUserLocale: doc.allowCustomUserLocale
        }
      });
    }

    handleEnableAllLanguages = (isEnabled) => {
      Meteor.call("shop/updateLanguageConfiguration", "all", isEnabled, methodAlertCallback);
    }

    handleEnableAllCurrencies = (isEnabled) => {
      Meteor.call("shop/updateCurrencyConfiguration", "all", isEnabled, methodAlertCallback);
    }

    render() {
      return (
        <Comp
          {...this.props}
          onUpdateLocalization={this.handleSubmit}
        />
      );
    }
  }
);

/**
 * @private
 * @param {Object} props Props
 * @param {Function} onData Call this to update props
 * @returns {undefined}
 */
function composer(props, onData) {
  const shop = Shops.findOne();

  const { unitsOfMeasure } = shop;
  const uomOptions = [];
  if (Array.isArray(unitsOfMeasure)) {
    for (const measure of unitsOfMeasure) {
      uomOptions.push({
        label: i18next.t(`uom.${measure.uom}`, { defaultValue: measure.uom }),
        value: measure.uom
      });
    }
  }

  const { unitsOfLength } = Shops.findOne();
  const uolOptions = [];
  if (Array.isArray(unitsOfLength)) {
    for (const length of unitsOfLength) {
      uolOptions.push({
        label: i18next.t(`uol.${length.uol}`, { defaultValue: length.uol }),
        value: length.uol
      });
    }
  }

  const label = i18next.t("app.timezoneOptions", "Choose timezone");
  const timezoneOptions = [{
    value: "",
    label
  }];
  const moment = props.momentTimezone;
  if (moment) {
    const timezones = moment.names();
    for (const timezone of timezones) {
      timezoneOptions.push({
        value: timezone,
        label: timezone
      });
    }
  }

  onData(null, {
    preferences: {},
    shop,
    languages,
    countryOptions: CountryOptions,
    currencyOptions: CurrencyOptions,
    uomOptions,
    uolOptions,
    timezoneOptions
  });
}

registerComponent("i18nSettings", LocalizationSettings, [
  withMomentTimezone,
  composeWithTracker(composer),
  wrapComponent
]);

export default compose(
  withMomentTimezone,
  composeWithTracker(composer),
  wrapComponent
)(LocalizationSettings);
