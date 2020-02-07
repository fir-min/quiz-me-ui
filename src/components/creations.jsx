import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import { Redirect } from "react-router-dom";
import QuizMeService from "../services/quizMeService";
import { serviceWrapper } from "../common/utils";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

class Creations extends Component {
  static contextType = GlobalContext;
  state = {
    quizzes: [],
    flashcard_decks: []
  };

  constructor(props, context) {
    super(props, context);
    if (this.context.user.isLoggedIn) {
      this.loadQuizzes();
      this.loadFlashcardDecks();
    }
  }

  loadQuizzes = async () => {
    await serviceWrapper(
      QuizMeService.getUserQuizzes,
      {
        userId: this.context.user.id,
        token: this.context.user.token
      },
      json => {
        let _state = this.state;
        _state.quizzes = json;
        this.setState(_state);
      },
      this.context.modals.openErrorModal
    );
  };

  loadFlashcardDecks = async () => {
    await serviceWrapper(
      QuizMeService.getUserFlashcardDecks,
      {
        userId: this.context.user.id,
        token: this.context.user.token
      },
      json => {
        let _state = this.state;
        console.log("card res");
        console.log(json);
        _state.flashcard_decks = json;
        this.setState(_state);
      },
      this.context.modals.openErrorModal
    );
  };

  preRender = () => {
    if (!this.context.user.isLoggedIn) {
      return <Redirect to="/" />;
    }
  };

  renderFlashcardDecks = () => {
    return (
      <div className="flashcard-deck-grid qm-text-primary-medium">
        {this.state.flashcard_decks.map(it => (
          <Card key={it.id} className="flashcard-deck qm-card">
            <Card.Body>
              <Card.Title>{it.name}</Card.Title>
              <Card.Text>{it.description}</Card.Text>
              <div className="form-inline">
                <button className="mr-auto border-less background-less qm-text-secondary-light icon-secondary">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="mr-auto ml-auto border-less background-less qm-text-secondary-light icon-secondary">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="ml-auto border-less background-less qm-text-secondary-light icon-secondary">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

  renderQuizzes = () => {
    return (
      <div className="quiz-grid qm-text-primary-medium">
        {this.state.quizzes.map(it => (
          <Card key={it.id} className="quiz qm-card">
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
                  <Card.Title>{it.name}</Card.Title>
                  <Card.Text>{it.description}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.preRender()}
        <div>
          <div className="form-inline">
            <h3 className="qm-text-secondary-medium">My Quizzes</h3>
            <button className="btn btn-outline-primary ml-auto">Create</button>
          </div>
          <div style={{ paddingTop: ".5em", paddingBottom: ".5em" }}>
            {this.renderQuizzes()}
          </div>
        </div>
        <div>
          <div className="form-inline mt-5">
            <h3 className="qm-text-secondary-medium">My Flashcard Decks</h3>
            <button className="btn btn-outline-primary ml-auto">Create</button>
          </div>
          <div style={{ paddingTop: ".5em", paddingBottom: ".5em" }}>
            {this.renderFlashcardDecks()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Creations;
