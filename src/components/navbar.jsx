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
    transform: "translate(-50%, -50%)",
    width: "40%",
    zIndex: "999",
    backgroundColor: "transparent",
    border: "none",
  },
};

Modal.setAppElement("#modals");

class NavBar extends Component {
  static contextType = GlobalContext;

  state = {
    signUpModalIsOpen: false,
    loginModalIsOpen: false,
    email: undefined,
    password: undefined,
    firstName: undefined,
    lastName: undefined,
    userId: undefined,
    menuClasses: "hidden",
    mobile: false,
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
    this.setState(_state);

    await this.context.utils.loaderWrapper(() => {
      this.context.user.login(this.state.email, this.state.password);
    });
  };

  signUp = async () => {
    let _state = this.state;
    _state.signUpModalIsOpen = false;
    this.setState(_state);

    await this.context.utils.loaderWrapper(() => {
      this.context.user.signUp(
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        this.state.password
      );
    });
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  getProfile = () => {
    if (this.context.user.isLoggedIn) {
      return (
        <NavLink
          onClick={this.preRouting}
          to="/creations"
          activeClassName="border-b border-teal-500"
          className="block mt-4 lg:inline-block lg:mt-0 text-indigo-500 hover:text-teal-500 mr-4"
        >
          Creations
        </NavLink>
      );
    }
  };

  logout = async () => {
    let _state = this.state;
    _state.loginModalIsOpen = false;

    this.setState(_state);
    await this.context.utils.loaderWrapper(this.context.user.logout);
  };

  getLoginButton = () => {
    if (this.context.user.isLoggedIn) {
      return (
        <button
          className="inline-block text-sm px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:border-transparent hover:text-white hover:bg-indigo-500 mt-4 mr-4 lg:mt-0"
          onClick={this.logout}
        >
          Sign out
        </button>
      );
    }

    return (
      <React.Fragment>
        <button
          onClick={this.openLoginModal}
          className="inline-block text-sm px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:border-transparent hover:text-white hover:bg-indigo-500 mt-4 mr-4 lg:mt-0"
        >
          Sign in
        </button>
        <button
          onClick={this.openSignUpModal}
          className="inline-block text-sm px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:border-transparent hover:text-white hover:bg-indigo-500 mt-4 mr-4 lg:mt-0"
        >
          Register
        </button>
      </React.Fragment>
    );
  };

  toggleMenuVisibility = () => {
    let _state = this.state;
    if (_state.menuClasses === "") {
      _state.menuClasses = "hidden";
    } else {
      _state.menuClasses = "";
    }
    _state.mobile = true;
    this.setState(_state);
  };

  preRouting = () => {
    if (this.state.mobile) {
      this.toggleMenuVisibility();
    }
  };

  render() {
    return (
      <React.Fragment>
        <nav className="flex items-center justify-between flex-wrap p-4 border-b border-gray-300">
          <div className="flex items-center flex-shrink-0 text-indigo-600 mr-6 ml-2">
            <NavLink
              exact
              onClick={this.preRouting}
              to="/"
              activeClassName="border-b border-teal-500"
              className="font-semibold text-xl tracking-tight"
            >
              Quizzr
            </NavLink>
          </div>
          <div className="block lg:hidden xl:hidden">
            <button
              className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-indigo-500 hover:border-indigo-500"
              onClick={this.toggleMenuVisibility}
            >
              <svg
                className="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div
            className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${this.state.menuClasses}`}
          >
            <div className="text-sm lg:flex-grow">
              <NavLink
                onClick={this.preRouting}
                to="/browse"
                className="block mt-4 lg:inline-block lg:mt-0 text-indigo-500 hover:text-teal-500 mr-4"
                activeClassName="border-b border-teal-500"
              >
                Browse
              </NavLink>
              {this.getProfile()}
            </div>
            <div>{this.getLoginButton()}</div>
          </div>
        </nav>

        <Modal
          isOpen={this.state.loginModalIsOpen}
          onRequestClose={this.closeLoginModal}
          style={modalStyles}
          contentLabel="login modal"
          key="loginModal"
        >
          <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 max-w-sm mx-auto">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="emaiil"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="alfred@bat.cave"
                onChange={(e) => this.handleChange("email", e)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                onChange={(e) => this.handleChange("password", e)}
                placeholder="******************"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                className="bg-indigo-500 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={(e) => this.login()}
              >
                Sign In
              </button>
              <button
                className="text-teal-500 font-bold py-2 pl-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.signUpModalIsOpen}
          onRequestClose={this.closeSignUpModal}
          style={modalStyles}
          contentLabel="sing up modal"
          key="signUpModal"
        >
          <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 max-w-sm mx-auto">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="firstname"
              >
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstname"
                type="text"
                placeholder="Alfred"
                onChange={(e) => this.handleChange("firstName", e)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="lastname"
              >
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastname"
                type="text"
                placeholder="Pennyworth"
                onChange={(e) => this.handleChange("lastName", e)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="alfred@bat.cave"
                onChange={(e) => this.handleChange("email", e)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                onChange={(e) => this.handleChange("password", e)}
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                className="bg-indigo-500 hover:shadow-base text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={(e) => this.signUp()}
              >
                Register
              </button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default NavBar;
