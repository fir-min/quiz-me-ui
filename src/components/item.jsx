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
          <FontAwesomeIcon
            icon={faEye}
            className="text-indigo-500 hover:text-teal-500"
          />
        </button>
      );
    }
  };

  getStudyButton = () => {
    if (this.props.onStudy) {
      return (
        <button title="study" className="block" onClick={this.props.onStudy}>
          <FontAwesomeIcon
            icon={faChalkboardTeacher}
            className="text-indigo-500 hover:text-teal-500"
          />
        </button>
      );
    }
  };

  getEditButton = () => {
    if (this.props.onEdit) {
      return (
        <button title="edit" className="block" onClick={this.props.onEdit}>
          <FontAwesomeIcon
            icon={faEdit}
            className="text-indigo-500 hover:text-teal-500"
          />
        </button>
      );
    }
  };

  getDeleteButton = () => {
    if (this.props.onDelete) {
      return (
        <button title="delete" className="block" onClick={this.props.onDelete}>
          <FontAwesomeIcon
            icon={faTrash}
            className="text-indigo-500 hover:text-teal-500"
          />
        </button>
      );
    }
  };

  render() {
    return (
      <div
        key={this.props.item.id}
        className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-full"
      >
        <div>
          <div className="flex my-2 rounded-md mx-2 shadow-md bg-gray-100">
            <div className="border-r border-gray-300 border-dashed px-2 my-2 py-2">
              {this.getStudyButton()}
              {this.getEditButton()}
              {this.getDeleteButton()}
            </div>
            <div className="ml-2 my-3 mr-2">
              <div className="font-medium text-gray-800">
                {this.props.item.name}
              </div>
              <p className="break-all font-normal text-gray-600">
                {this.props.item.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
