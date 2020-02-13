import React, { Component } from "react";
import { Card } from "semantic-ui-react";
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
      <Card key={this.props.item.id} className="quiz qm-card">
        <Card.Body>
          <div className="form-inline">
            <div className="right-border-dotted mr-2">
              {this.getViewButton()}
              {this.getStudyButton()}
              {this.getEditButton()}
              {this.getDeleteButton()}
            </div>
            <div>
              <Card.Title>{this.props.item.name}</Card.Title>
              <Card.Text>{this.props.item.description}</Card.Text>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default Item;
