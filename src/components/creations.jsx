import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import { Redirect } from "react-router-dom";
import QuizMeService from "../services/quizMeService";
import { serviceWrapper } from "../common/utils";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Item from "./item";

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
          <Item
            item={it}
            onView={() => alert(`you are viewing ${it.name}`)}
            onDelete={() => alert(`you are deleting ${it.name}`)}
            onEdit={() => alert(`you are editing ${it.name}`)}
          ></Item>
        ))}
      </div>
    );
  };

  renderQuizzes = () => {
    return (
      <div className="quiz-grid qm-text-primary-medium">
        {this.state.quizzes.map(it => (
          <Item
            item={it}
            onView={() => alert(`you are viewing ${it.name}`)}
            onDelete={() => alert(`you are deleting ${it.name}`)}
            onEdit={() => alert(`you are editing ${it.name}`)}
          ></Item>
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
