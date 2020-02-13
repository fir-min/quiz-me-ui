import React, { Component } from "react";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";
import { Menu, Segment } from "semantic-ui-react";
import GlobalContext from "./contexts/globalContext";
import { Icon } from "semantic-ui-react";

import { Button } from "semantic-ui-react";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

Modal.setAppElement("#root");

class NavBar extends Component {
  static contextType = GlobalContext;

  state = {
    signUpModalIsOpen: false,
    loginModalIsOpen: false,
    email: undefined,
    password: undefined,
    firstName: undefined,
    lastName: undefined,
    userId: undefined
  };

  closeLoginModal = () => {
    let _state = this.state;
    _state.loginModalIsOpen = false;
    this.setState(_state);
  };

  openLoginModal = () => {
    let _state = this.state;
    _state.loginModalIsOpen = true;
    this.setState(_state);
  };

  openSignUpModal = () => {
    let _state = this.state;
    _state.signUpModalIsOpen = true;
    this.setState(_state);
  };

  closeSignUpModal = () => {
    let _state = this.state;
    _state.signUpModalIsOpen = false;
    this.setState(_state);
  };

  login = async () => {
    let _state = this.state;
    _state.loginModalIsOpen = false;

    await this.context.user.login(this.state.email, this.state.password);
    this.setState(_state);
  };

  signUp = async () => {
    let _state = this.state;
    _state.signUpModalIsOpen = false;
    await this.context.user.signUp(
      this.state.firstName,
      this.state.lastName,
      this.state.email,
      this.state.password
    );
    this.setState(_state);
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  getProfile = () => {
    const { activeItem } = this.state;
    if (this.context.user.isLoggedIn) {
      return (
        <React.Fragment>
          <Menu.Item
            name="creations"
            active={activeItem === "creations"}
            onClick={this.handleItemClick}
          >
            <NavLink to="/creations">Creations</NavLink>
          </Menu.Item>
        </React.Fragment>
      );
    }
  };

  logout = () => {
    let _state = this.state;
    _state.loginModalIsOpen = false;
    this.context.user.logout();
    this.setState(_state);
  };

  getLoginButton = () => {
    if (this.context.user.isLoggedIn) {
      return (
        <React.Fragment>
          <Menu.Item onClick={this.openLoginModal}>
            <Icon borderless name="sign out" size="large" />
          </Menu.Item>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Menu.Item onClick={this.openLoginModal}>
          <Icon borderless name="sign in" size="large" />
        </Menu.Item>

        <Menu.Item onClick={this.openSignUpModal}>
          <Icon.Group size="large">
            <Icon borderless name="user" />
            <Icon borderless corner name="add" />
          </Icon.Group>
        </Menu.Item>
      </React.Fragment>
    );
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <React.Fragment>
        <Menu computer only secondary>
          <Menu.Item name="home" onClick={this.handleItemClick}>
            <NavLink to="/">Quizzr</NavLink>
          </Menu.Item>

          <Menu.Item
            name="home"
            active={activeItem === "home"}
            onClick={this.handleItemClick}
          >
            <NavLink exact to="/">
              Home
            </NavLink>
          </Menu.Item>

          <Menu.Item
            name="search"
            active={activeItem === "search"}
            onClick={this.handleItemClick}
          >
            <NavLink to="/search">Search</NavLink>
          </Menu.Item>

          {this.getProfile()}
          <Menu.Menu position="right">{this.getLoginButton()}</Menu.Menu>
        </Menu>

        <Modal
          isOpen={this.state.loginModalIsOpen}
          onRequestClose={this.closeLoginModal}
          style={modalStyles}
          contentLabel="login modal"
          key="loginModal"
        >
          <h2 className="qm-text-primary">Login</h2>
          <form className="form my-2 my-lg-0">
            <input
              className="form-control mr-sm-2 my-2"
              type="email"
              placeholder="Email"
              aria-label="email"
              onChange={e => this.handleChange("email", e)}
            />

            <input
              className="form-control mr-sm-2 my-2"
              type="password"
              placeholder="Password"
              aria-label="password"
              onChange={e => this.handleChange("password", e)}
            />

            <div className="form-inline">
              <button
                className="btn btn-outline-info my-2 my-sm-0"
                type="submit"
                onClick={this.closeLoginModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-outline-info my-2 my-sm-0 ml-auto"
                onClick={e => this.login()}
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={this.state.signUpModalIsOpen}
          onRequestClose={this.closeSignUpModal}
          style={modalStyles}
          contentLabel="sing up modal"
          key="signUpModal"
        >
          <h2 className="qm-text-primary">Sign up</h2>
          <form className="form my-2 my-lg-0">
            <input
              className="form-control mr-sm-2 my-2"
              type="text"
              placeholder="First Name"
              aria-label="first name"
              onChange={e => this.handleChange("firstName", e)}
            />
            <input
              className="form-control mr-sm-2 my-2"
              type="text"
              placeholder="Last Name"
              aria-label="last name"
              onChange={e => this.handleChange("lastName", e)}
            />

            <input
              className="form-control mr-sm-2 my-2"
              type="text"
              placeholder="Email"
              aria-label="email"
              onChange={e => this.handleChange("email", e)}
            />

            <input
              className="form-control mr-sm-2 my-2"
              type="password"
              placeholder="Password"
              aria-label="password"
              onChange={e => this.handleChange("password", e)}
            />

            <div className="form-inline">
              <button
                className="btn btn-outline-info my-2 my-sm-0"
                onClick={this.closeSignUpModal}
              >
                Cancel
              </button>
              <Button onClick={e => this.signUp()}>Submit</Button>
            </div>
          </form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default NavBar;
