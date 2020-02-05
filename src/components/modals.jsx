import React, { Component } from "react";
import Modal from "react-modal";
import ModalsContext from "./contexts/modalsContext";

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

class Modals extends Component {
  state = {
    showErrorModal: false,
    errorModalContent: undefined,
    showWarningModal: false,
    warningModalContent: undefined,
    showMessageModal: false,
    messageModalContent: undefined
  };

  closeErrorModal = () => {
    let _state = this.state;
    _state.errorModalContent = "";
    _state.showErrorModal = false;
    this.setState(_state);
  };

  closeMessageModal = () => {
    let _state = this.state;
    _state.messageModalContent = "";
    _state.showErrorModal = false;
    this.setState(_state);
  };

  closeWarningModal = () => {
    let _state = this.state;
    _state.warningModalContent = "";
    _state.showWarningModal = false;
    this.setState(_state);
  };

  openErrorModal = content => {
    let _state = this.state;
    _state.errorModalContent = <h4>{content}</h4>;
    _state.showErrorModal = true;
    this.setState(_state);
  };

  openMessageModal = content => {
    let _state = this.state;
    _state.messageModalContent = <h4>{content}</h4>;
    _state.showMessageModal = true;
    this.setState(_state);
  };

  openWarningModal = content => {
    let _state = this.state;
    _state.warningModalContent = <h4>{content}</h4>;
    _state.showWarningModal = true;
    this.setState(_state);
  };

  render() {
    return (
      <ModalsContext.Provider
        value={{
          openErrorModal: this.openErrorModal,
          closeErrorModal: this.closeErrorModal,
          openMessageModal: this.openMessageModal,
          closeMessageModal: this.closeMessageModal,
          openWarningModal: this.openWarningModal,
          closeWarningModal: this.closeWarningModal
        }}
      >
        <React.Fragment>
          <Modal
            isOpen={this.state.showErrorModal}
            onRequestClose={this.closeErrorModal}
            style={modalStyles}
            contentLabel="error modal"
            key="errorModal"
          >
            <h2 className="my-2">Error</h2>
            {this.state.errorModalContent}
            <form className="form-inline my-2 my-lg-0">
              <button
                className="btn btn-outline-primary ml-auto my-2 my-sm-0"
                type="submit"
                onClick={this.closeErrorModal}
              >
                Close
              </button>
            </form>
          </Modal>

          <Modal
            isOpen={this.state.showMessageModal}
            onRequestClose={this.closeMessageModal}
            style={modalStyles}
            contentLabel="message modal"
            key="messageModal"
          >
            <h2 className="my-2">Message</h2>
            {this.state.messageModalContent}
            <p>Please try again later.</p>
            <form className="form-inline my-2 my-lg-0">
              <button
                className="btn btn-outline-primary ml-auto my-2 my-sm-0"
                type="submit"
                onClick={this.closeMessageModal}
              >
                Close
              </button>
            </form>
          </Modal>

          <Modal
            isOpen={this.state.showWarningModal}
            onRequestClose={this.closeWarningModal}
            style={modalStyles}
            contentLabel="warning modal"
            key="warningModal"
          >
            <h2 className="my-2">Warning</h2>
            {this.state.warningModalContent}
            <form className="form-inline my-2 my-lg-0">
              <button
                className="btn btn-outline-primary ml-auto my-2 my-sm-0"
                type="submit"
                onClick={this.closeWarningModal}
              >
                Close
              </button>
            </form>
          </Modal>
        </React.Fragment>
        {this.props.children}
      </ModalsContext.Provider>
    );
  }
}

export default Modals;
