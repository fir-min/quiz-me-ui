import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

class Item extends Component {
  state = {};

  getViewButton = () => {
    if (this.props.onView) {
      return (
        <button
          title="view & use item"
          className="border-less background-less qm-text-secondary-light icon-secondary vert-button"
          onClick={this.props.onView}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
      );
    }
  };

  getEditButton = () => {
    if (this.props.onEdit) {
      return (
        <button
          title="edit item"
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
          title="delete item"
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
