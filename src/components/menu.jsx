import React, { Component } from "react";

import { NavLink } from "react-router-dom";

import {
  Container,
  Icon,
  Menu,
  Sidebar,
  Responsive,
  Button,
  Header,
  Modal
} from "semantic-ui-react";
import GlobalContext from "./contexts/globalContext";

class NavBarMobile extends Component {
  render() {
    const {
      leftItems,
      rightItems,
      visible,
      onToggle,
      handleItemClick
    } = this.props;

    return (
      <React.Fragment>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            icon="labeled"
            inverted
            vertical
            visible={visible}
            width="thin"
          >
            {leftItems}
          </Sidebar>
          <Sidebar.Pusher dimmed={visible} style={{ minHeight: "100vh" }}>
            <Menu borderless fixed="top">
              <Menu.Item onClick={onToggle}>
                <Icon name="sidebar" />
              </Menu.Item>
              <Menu.Item name="home" onClick={handleItemClick}>
                <NavLink to="/">Quizzr</NavLink>
              </Menu.Item>
              <Menu.Menu position="right">{rightItems}</Menu.Menu>
            </Menu>
            <Container style={{ marginTop: "5em" }}>
              {this.props.children}
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </React.Fragment>
    );
  }
}

class NavBarDesktop extends Component {
  render() {
    const { leftItems, rightItems, handleItemClick } = this.props;
    return (
      <React.Fragment>
        <Menu
          borderless
          fixed="top"
          style={{ boxShadow: "none", borderBottom: "0px none" }}
        >
          <Menu.Item name="home" onClick={handleItemClick}>
            <NavLink to="/">Quizzr</NavLink>
          </Menu.Item>
          {leftItems}
          <Menu.Menu position="right">{rightItems}</Menu.Menu>
        </Menu>
        <Container style={{ marginTop: "5em" }}>
          {this.props.children}
        </Container>
      </React.Fragment>
    );
  }
}

class MenuBar extends Component {
  static contextType = GlobalContext;

  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleToggle = () => this.setState({ visible: !this.state.visible });

  getLeftItems = () => {
    const { activeItem } = this.state;
    if (this.context.user.isLoggedIn) {
      return (
        <React.Fragment>
          <Menu.Item
            name="search"
            active={activeItem === "search"}
            onClick={this.handleItemClick}
          >
            <NavLink to="/search">Search</NavLink>
          </Menu.Item>
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
    return (
      <React.Fragment>
        <Menu.Item
          name="search"
          active={activeItem === "search"}
          onClick={this.handleItemClick}
        >
          <NavLink to="/search">Search</NavLink>
        </Menu.Item>
      </React.Fragment>
    );
  };

  getLeftItemsForMobile = () => {
    const { activeItem } = this.state;
    if (this.context.user.isLoggedIn) {
      return (
        <React.Fragment>
          <Menu.Item name="search" active={activeItem === "search"}>
            <NavLink
              to="/search"
              onClick={() => {
                this.handleItemClick(null, { name: "search" });
                this.handlePusher();
              }}
            >
              Search
            </NavLink>
          </Menu.Item>
          <Menu.Item name="creations" active={activeItem === "creations"}>
            <NavLink
              to="/creations"
              onClick={() => {
                this.handleItemClick(null, { name: "creations" });
                this.handlePusher();
              }}
            >
              Search
            </NavLink>
          </Menu.Item>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Menu.Item name="search" active={activeItem === "search"}>
          <NavLink
            to="/search"
            onClick={() => {
              this.handleItemClick(null, { name: "search" });
              this.handlePusher();
            }}
          >
            Search
          </NavLink>
        </Menu.Item>
      </React.Fragment>
    );
  };

  openLoginModal = () => {
    console.log("booyah");
    let _state = this.state;
    _state.loginModalIsOpen = true;
    this.setState(_state);
  };

  getRightItems = () => {
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
          <Icon
            circular
            inverted
            name="user add"
            size="large"
            color="purple-darker"
          />
        </Menu.Item>
      </React.Fragment>
    );
  };

  render() {
    const { visible } = this.state;
    const leftItems = this.getLeftItems();
    const leftItemsForMobile = this.getLeftItemsForMobile();

    const rightItems = this.getRightItems();

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            leftItems={leftItemsForMobile}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}
            handleItemClick={this.handleItemClick}
          >
            {this.props.children}
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop
            leftItems={leftItems}
            rightItems={rightItems}
            handleItemClick={this.handleItemClick}
          >
            {this.props.children}
          </NavBarDesktop>
        </Responsive>

        <Modal
          trigger={
            <Button inverted color="red" onClick={this.handleOpen}>
              Show Modal
            </Button>
          }
          open={this.state.modalOpen}
          onClose={this.handleClose}
          basic
          size="small"
        >
          <Header icon="browser" content="Cookies policy" />
          <Modal.Content>
            <h3>
              This website uses cookies to ensure the best user experience.
            </h3>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.handleClose} inverted>
              <Icon name="checkmark" /> Got it
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default MenuBar;
