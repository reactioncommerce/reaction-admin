import React, { Component } from "react";
import PropTypes from "prop-types";
import { ExampleSettingsForm } from "../components";

class ExampleSettingsFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: "278302390293"
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ apiKey: event.target.value });
  }

  render() {
    return (
      <ExampleSettingsForm
        onChange={this.handleChange}
        settings={this.props.packageData.settings}
      />
    );
  }
}

ExampleSettingsFormContainer.propTypes = {
  packageData: PropTypes.object
};

export default ExampleSettingsFormContainer;
