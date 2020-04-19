import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import Item from "./item";
import { apiWrapper } from "../common/utils";
import QuizMeService from "../services/quizMeService";

class Search extends Component {
  static contextType = GlobalContext;
  state = {
    quizzes: [],
    flashcard_decks: [],
  };

  constructor(props, context) {
    super(props, context);

    this.loadQuizzes();
    this.loadFlashcardDecks();
  }

  loadQuizzes = async () => {
    await apiWrapper(
      QuizMeService.getQuizzes,
      {},
      (json) => {
        let _state = this.state;
        _state.quizzes = json;
        this.setState(_state);
      },
      this.context.modals.openErrorModal,
      this.context.user.logout
    );
  };

  loadFlashcardDecks = async () => {
    await apiWrapper(
      QuizMeService.getFlashcardDecks,
      {},
      (json) => {
        let _state = this.state;
        _state.flashcard_decks = json;
        this.setState(_state);
      },
      this.context.modals.openErrorModal,
      this.context.user.logout
    );
  };

  renderQuizzes = () => {
    return (
      <div className="flex flex-wrap">
        {this.state.quizzes.map((it) => (
          <Item
            key={`qi-${it.id}`}
            item={it}
            onStudy={() => this.props.history.push(`/quiz/${it.id}/study`)}
          ></Item>
        ))}
      </div>
    );
  };

  renderFlashcardDecks = () => {
    return (
      <div className="flex flex-wrap">
        {this.state.flashcard_decks.map((it) => (
          <Item
            key={`fi-{it.id}`}
            item={it}
            onStudy={() =>
              this.props.history.push(`/flashcard-deck/${it.id}/study`)
            }
          ></Item>
        ))}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="h-screen">
          <div className="container">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-teal-500">Quizzes</p>
            </div>
          </div>
          <div style={{ paddingTop: ".5em", paddingBottom: ".5em" }}>
            {this.renderQuizzes()}
          </div>

          <div className="border-b border-gray-300 my-4"></div>

          <div className="container">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-teal-500">Flashcard Decks</p>
            </div>
          </div>
          <div style={{ paddingTop: ".5em", paddingBottom: ".5em" }}>
            {this.renderFlashcardDecks()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Search;
