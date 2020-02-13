import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faEdit,
  faChalkboardTeacher
} from "@fortawesome/free-solid-svg-icons";

class Item extends Component {
  state = {};

  getViewButton = () => {
    if (this.props.onView) {
      return (
        <button
          title="view"
          className="border-less background-less qm-text-secondary-light icon-secondary vert-button"
          onClick={this.props.onView}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
      );
    }
  };

  getStudyButton = () => {
    if (this.props.onStudy) {
      return (
        <button
          title="study"
          className="border-less background-less qm-text-secondary-light icon-secondary vert-button"
          onClick={this.props.onStudy}
        >
          <FontAwesomeIcon icon={faChalkboardTeacher} />
        </button>
      );
    }
  };

  getEditButton = () => {
    if (this.props.onEdit) {
      return (
        <button
          title="edit"
          className="border-less background-less qm-text-secondary-light icon-secondary vert-button"
          onClick={this.props.onEdit}
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
      );
    }
  };

  getDeleteButton = () => {
    if (this.props.onDelete) {
      return (
        <button
          title="delete"
          className="border-less background-less qm-text-secondary-light icon-secondary vert-button"
          onClick={this.props.onDelete}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      );
    }
  };

  render() {
    return (
      <div key={this.props.item.id} className="quiz qm-div">
        <div>
          <div className="form-inline">
            <div className="right-border-dotted mr-2">
              {this.getViewButton()}
              {this.getStudyButton()}
              {this.getEditButton()}
              {this.getDeleteButton()}
            </div>
            <div>
              <div>{this.props.item.name}</div>
              <div>{this.props.item.description}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
