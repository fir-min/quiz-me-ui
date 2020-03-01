import React, { Component } from "react";

class Container extends Component {
  state = {};
  render() {
    return (
      <div className="qm-bg w-screen h-screen">
        <div className="mx-auto px-6 my-6 bg-gray-100 container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Container;
