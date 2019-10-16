import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

/**
 * @file
 * Link is a drop-in replacement for the HTML <a> tag. It uses Reaction's router to navigate to the specified href,
 * preventing the entire client app from reloading. It also scrolls to the top of the next page.
 *
 * @module Link
 * @extends Component
 */

class Link extends Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  handleClick = (event) => {
    event.preventDefault();
    this.props.onClick(event);
    history.push(this.props.href); // eslint-disable-line no-undef

    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo(0, 0);
    }
  };

  render() {
    const { href, children } = this.props; // eslint-disable-line react/prop-types
    return (
      <a href={href} {...this.props} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

export default withRouter(Link);
