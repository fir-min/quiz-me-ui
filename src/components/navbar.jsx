import React, { Component } from "react";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";
import GlobalContext from "./contexts/globalContext";

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

    this.context.user.login(this.state.email, this.state.password);
    this.setState(_state);
  };

  signUp = async () => {
    let _state = this.state;
    _state.signUpModalIsOpen = false;
    await this.props.onSignUp(
      this.state.email,
      this.state.password,
      this.state.firstName,
      this.state.lastName
    );
    this.setState(_state);
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  getProfile = () => {
    if (this.context.isLoggedIn) {
      return (
        <React.Fragment>
          <li className="nav-item">
            <NavLink
              to="/creations"
              activeClassName="active"
              className="nav-link futura"
            >
              Creations
            </NavLink>
          </li>
        </React.Fragment>
      );
    }
  };

  logout = () => {
    let _state = this.state;
    _state.loginModalIsOpen = false;
    this.setState(_state);
  };

  getLoginButton = () => {
    if (this.context.isLoggedIn) {
      return (
        <button
          className="btn btn-outline-success my-2 my-sm-0 ml-5 mr-5 futura"
          onClick={e => this.context.logout()}
        >
          Logout
        </button>
      );
    }

    return (
      <React.Fragment>
        <button
          className="btn btn-outline-success my-2 my-sm-0 mr-2 futura"
          onClick={this.openLoginModal}
        >
          Login
        </button>

        <button
          className="btn btn-outline-success my-2 my-sm-0 mr-5 futura"
          onClick={this.openSignUpModal}
        >
          Sign up
        </button>
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <NavLink
              to="/"
              activeClassName="active"
              className="navbar-brand futura"
            >
              Quiz Me
            </NavLink>
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <NavLink
                  exact
                  to="/"
                  activeClassName="active"
                  className="nav-link futura"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/search"
                  activeClassName="active"
                  className="nav-link futura"
                >
                  Search
                </NavLink>
              </li>
              {this.getProfile()}
            </ul>

            {this.getLoginButton()}
          </div>
        </nav>

        <Modal
          isOpen={this.state.loginModalIsOpen}
          onRequestClose={this.closeLoginModal}
          style={modalStyles}
          contentLabel="login modal"
          key="loginModal"
        >
          <h2>Login</h2>
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
                className="btn btn-outline-danger my-2 my-sm-0"
                type="submit"
                onClick={this.closeLoginModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-outline-success my-2 my-sm-0 ml-auto"
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
          <h2>Sign up</h2>
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
                className="btn btn-outline-danger my-2 my-sm-0"
                onClick={this.closeSignUpModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-outline-success my-2 my-sm-0 ml-auto"
                onClick={e => this.signUp()}
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default NavBar;
