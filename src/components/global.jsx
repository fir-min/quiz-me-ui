import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import { readUserData, saveUserData, clearUserData } from "../common/utils";
import { apiWrapper } from "../common/utils";
import QuizMeService from "../services/quizMeService";
import ModalsContext from "./contexts/modalsContext";
import { timeout } from "../common/utils";

class Global extends Component {
  static contextType = ModalsContext;
  state = {
    isLoggedIn: false,
    token: undefined,
    email: undefined,
    id: undefined,
    modals: undefined,
  };

  setUserData = (json) => {
    let _state = this.state;
    _state.email = json.email;
    _state.id = json.id;
    _state.token = json.token;
    _state.isLoggedIn = true;
    saveUserData({
      token: json.token,
      email: json.email,
      id: json.id,
    });
    this.setState(_state);
  };

  logout = () => {
    clearUserData();
    let _state = this.state;
    _state.email = undefined;
    _state.id = undefined;
    _state.token = undefined;
    _state.isLoggedIn = false;
    this.setState(_state);
  };

  login = (email, password) => {
    const req = {
      body: {
        email: email,
        password: password,
      },
    };

    apiWrapper(
      QuizMeService.login,
      req,
      (json) => {
        this.setUserData(json);
      },
      this.context.openErrorModal
    );
  };

  signUp = (firstName, lastName, email, password) => {
    const req = {
      body: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      },
    };

    apiWrapper(
      QuizMeService.register,
      req,
      (json) => {
        this.setUserData(json);
      },
      this.context.openErrorModal
    );
  };

  loadData = () => {
    let data = readUserData();
    if (data) {
      //console.log(data);
      //console.log(data.token);
      let _state = this.state;
      _state.isLoggedIn = true;
      _state.email = data.email;
      _state.id = data.id;
      _state.token = data.token;
    }
  };

  constructor() {
    super();
    this.loadData();
  }

  wrapInLoader = async (func) => {
    await this.context.openLoadingModal();
    await timeout(250);
    let r = await func();
    await timeout(250);
    await this.context.closeLoadingModal();
    return r;
  };

  render() {
    return (
      <ModalsContext.Consumer>
        {(modals) => {
          return (
            <GlobalContext.Provider
              value={{
                utils: {
                  loaderWrapper: this.wrapInLoader,
                },
                modals: modals,
                user: {
                  token: this.state.token,
                  email: this.state.email,
                  isLoggedIn: this.state.isLoggedIn,
                  id: this.state.id,
                  login: this.login,
                  logout: this.logout,
                  signUp: this.signUp,
                },
              }}
            >
              {this.props.children}
            </GlobalContext.Provider>
          );
        }}
      </ModalsContext.Consumer>
    );
  }
}

export default Global;
