import React, { Component } from "react";
import PropTypes from "prop-types";
import Blaze from "meteor/gadicc:blaze-react-component";
import { Components } from "@reactioncommerce/reaction-components";
import {
  FlatButton,
  VerticalDivider
} from "/imports/plugins/core/ui/client/components";
import { Translatable } from "/imports/plugins/core/ui/client/providers";

class PublishControls extends Component {
  static propTypes = {
    dashboardHeaderTemplate: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
    documentIds: PropTypes.arrayOf(PropTypes.string),
    documents: PropTypes.arrayOf(PropTypes.object),
    hasCreateProductAccess: PropTypes.bool,
    isEnabled: PropTypes.bool,
    onShopSelectChange: PropTypes.func,
    onVisibilityChange: PropTypes.func,
    packageButtons: PropTypes.arrayOf(PropTypes.object),
    shopId: PropTypes.string,
    shops: PropTypes.arrayOf(PropTypes.object),
    translation: PropTypes.shape({
      lang: PropTypes.string
    })
  }

  static defaultProps = {
    isEnabled: true
  }

  // Passthrough to shopSelectChange handler in container above
  onShopSelectChange = (event, shopId) => {
    if (typeof this.props.onShopSelectChange === "function") {
      this.props.onShopSelectChange(event, shopId);
    }
  }

  renderViewControls() {
    return (
      <FlatButton
        label="Private"
        i18nKeyLabel="app.private"
        i18nKeyToggleOnLabel="app.public"
        toggleOnLabel="Public"
        icon="fa fa-eye-slash"
        onIcon="fa fa-eye"
        toggle={true}
        value="public"
        onValue="private"
        toggleOn={this.isVisible === "public"}
        onToggle={this.handleVisibilityChange}
      />
    );
  }

  renderCustomControls() {
    if (this.props.dashboardHeaderTemplate && this.props.hasCreateProductAccess) {
      if (this.props.isEnabled) {
        return [
          <div className="hidden-xs" key="customControlsVerticaldivider"><VerticalDivider/></div>,
          <Blaze key="customControls" template={this.props.dashboardHeaderTemplate} />
        ];
      }
      return [
        <Blaze key="customControls" template={this.props.dashboardHeaderTemplate} />
      ];
    }

    return null;
  }

  render() {
    return (
      <Components.Toolbar>
        <Components.ToolbarGroup lastChild={true}>
          {this.renderCustomControls()}
        </Components.ToolbarGroup>
      </Components.Toolbar>
    );
  }
}

export default Translatable()(PublishControls);
