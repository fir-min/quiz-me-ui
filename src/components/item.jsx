import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

class Item extends Component {
  state = {};
  render() {
    return (
      <Card key={this.props.item.id} className="quiz qm-card">
        <Card.Body>
          <div className="form-inline">
            <div className="right-border-dotted mr-2">
              <button className="border-less background-less qm-text-secondary-light icon-secondary vert-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="border-less background-less qm-text-secondary-light icon-secondary vert-button">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="border-less background-less qm-text-secondary-light icon-secondary vert-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
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
