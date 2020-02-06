import React, { Component } from "react";

class Container extends Component {
  state = {};
  render() {
    return <div className="qm-container">{this.props.children}</div>;
  }
}

export default Container;
