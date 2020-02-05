import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import { Redirect } from "react-router-dom";

class Creations extends Component {
  static contextType = GlobalContext;
  state = {
    loggedIn: false
  };

  validate = () => {
    let _state = this.state;
    console.log(this.context);
    _state.loggedIn = true;
    if (!this.context.user.isLoggedIn) {
      this.context.modals.openErrorModal(
        "You need to be logged in to perform this action"
      );
      _state.loggedIn = false;
    }
    this.setState(_state);
  };

  preRender = () => {
    this.validate();
    return !this.state.loggedIn ? (
      <Redirect to="/" />
    ) : (
      <h1>USER CREATIONS!!</h1>
    );
  };

  render() {
    return <React.Fragment>{this.preRender()}</React.Fragment>;
  }
}

export default Creations;
