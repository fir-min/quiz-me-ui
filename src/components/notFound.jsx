import React, { Component } from "react";

class NotFound extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div>
          <div style={{ textAlign: "center" }}>
            <h4>That doesn't exist :(</h4>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NotFound;
