import React, { Component } from "react";

class Container extends Component {
  state = {};
  render() {
    return <div className="container mx-auto my-4">{this.props.children}</div>;
  }
}

export default Container;
