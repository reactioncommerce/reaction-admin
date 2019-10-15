import React, { Component } from "react";
import PropTypes from "prop-types";
import { Components } from "@reactioncommerce/reaction-components";
import { Shop as ShopSchema } from "/lib/collections/schemas";

const PACKAGE_NAME = "reaction-i18n";

class LocalizationSettings extends Component {
  static propTypes = {
    currencyOptions: PropTypes.array,
    languages: PropTypes.array,
    onUpdateLocalization: PropTypes.func,
    shop: PropTypes.object, // Shop data
    timezoneOptions: PropTypes.array,
    uolOptions: PropTypes.array,
    uomOptions: PropTypes.array
  }

  handleSubmit = (event, formData) => {
    if (typeof this.props.onUpdateLocalization === "function") {
      this.props.onUpdateLocalization(formData.doc);
    }
  }

  renderListControls(name) {
    return (
      <Components.CardToolbar>
        <Components.FlatButton
          i18nKeyLabel={"admin.i18nSettings.allOn"}
          label="All On"
          value={name}
          onClick={this.handleAllOn}
        />
        { "|" }
        <Components.FlatButton
          i18nKeyLabel={"admin.i18nSettings.allOff"}
          label="All Off"
          value={name}
          onClick={this.handleAllOff}
        />
      </Components.CardToolbar>
    );
  }

  render() {
    return (
      <Components.CardGroup>
        <Components.SettingsCard
          i18nKeyTitle="admin.i18nSettings.shopLocalization"
          name="localization"
          packageName={PACKAGE_NAME}
          saveOpenStateToPreferences={true}
          showSwitch={false}
          title="Shop Localization"
        >
          <Components.Form
            autoSave={true}
            schema={ShopSchema}
            doc={this.props.shop}
            fields={{
              timezone: {
                type: "select",
                options: this.props.timezoneOptions
              },
              currency: {
                type: "select",
                options: this.props.currencyOptions
              },
              baseUOM: {
                type: "select",
                options: this.props.uomOptions
              },
              baseUOL: {
                type: "select",
                options: this.props.uolOptions
              },
              language: {
                type: "select",
                options: this.props.languages
              },
              allowCustomUserLocale: {
                type: "boolean"
              }
            }}
            name="localization"
            onSubmit={this.handleSubmit}
          />
        </Components.SettingsCard>
      </Components.CardGroup>
    );
  }
}

export default LocalizationSettings;
