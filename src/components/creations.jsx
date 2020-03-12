import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import { Redirect } from "react-router-dom";
import QuizMeService from "../services/quizMeService";
import { apiWrapper } from "../common/utils";
import Item from "./item";
import Modal from "react-modal";
import Quiz from "./quiz";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100%",
    zIndex: "999",
    backgroundColor: "transparent",
    border: "none"
  }
};

Modal.setAppElement("#root");

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

  state = {
    quizModal: false,
    flashcardModal: false,
    quizzes: [],
    flashcard_decks: []
  };

  closeModal = name => {
    this.setState({ [name]: !this.state[name] });
  };

  loadQuizzes = async () => {
    await apiWrapper(
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
      this.context.modals.openErrorModal,
      this.context.user.logout
    );
  };

  loadFlashcardDecks = async () => {
    await apiWrapper(
      QuizMeService.getUserFlashcardDecks,
      {
        userId: this.context.user.id,
        token: this.context.user.token
      },
      json => {
        let _state = this.state;
        _state.flashcard_decks = json;
        this.setState(_state);
      },
      this.context.modals.openErrorModal,
      this.context.user.logout
    );
  };

  preRender = () => {
    if (!this.context.user.isLoggedIn) {
      return <Redirect to="/" />;
    }
  };

  deleteFlashcardDeck = flashcardDeck => {
    const req = {
      flashcard_deck_id: flashcardDeck.id,
      token: this.context.user.token
    };
    this.context.modals.openWarningModal(
      "Are you sure you want to delete these flashcards? This action cannot be undone.",
      async () => {
        await apiWrapper(
          QuizMeService.deleteFlashcardDeck,
          req,
          () => {
            let _state = this.state;
            _state.flashcard_decks = _state.flashcard_decks.filter(
              f => f.id !== flashcardDeck.id
            );
            this.setState(_state);
          },
          this.context.modals.openErrorModal,
          this.context.user.logout
        );
      }
    );
  };

  renderFlashcardDecks = () => {
    return (
      <div className="flex flex-wrap">
        {this.state.flashcard_decks.map(it => (
          <Item
            key={`fi-{it.id}`}
            item={it}
            onView={() => alert(`you are viewing ${it.name}`)}
            onStudy={() => alert(`you are viewing ${it.name}`)}
            onDelete={() => this.deleteFlashcardDeck(it)}
            onEdit={() => alert(`you are editing ${it.name}`)}
          ></Item>
        ))}
      </div>
    );
  };

  deleteQuiz = quiz => {
    const req = {
      quiz_id: quiz.id,
      token: this.context.user.token
    };
    this.context.modals.openWarningModal(
      "Are you sure you want to delete this quiz? This action cannot be undone.",
      async () => {
        await apiWrapper(
          QuizMeService.deleteQuiz,
          req,
          json => {
            let _state = this.state;
            _state.quizzes = _state.quizzes.filter(q => q.id !== quiz.id);
            this.setState(_state);
          },
          this.context.modals.openErrorModal,
          this.context.user.logout
        );
      }
    );
  };

  createQuiz = () => {
    const _state = this.state;
    _state.quiz = (
      <React.Fragment>
        <Quiz create={true}></Quiz>
      </React.Fragment>
    );
    _state.quizModal = !_state.quizModal;
    this.setState(_state);
  };

  editQuiz = quiz => {
    this.props.history.push(`/quiz/${quiz.id}/edit`);
  };

  renderQuizzes = () => {
    return (
      <div className="flex flex-wrap">
        {this.state.quizzes.map(it => (
          <Item
            key={`qi-${it.id}`}
            item={it}
            onView={() => alert(`you are viewing ${it.name}`)}
            onStudy={() => alert(`you are studying ${it.name}`)}
            onDelete={() => this.deleteQuiz(it)}
            onEdit={() => this.editQuiz(it)}
          ></Item>
        ))}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.preRender()}
        <div className="h-screen">
          <div className="container">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-teal-500">My Quizzes</p>
              <button
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:border-transparent hover:text-white hover:bg-indigo-500 lg:mt-0"
                onClick={() => this.createQuiz()}
              >
                New Quiz
              </button>
            </div>
          </div>
          <div style={{ paddingTop: ".5em", paddingBottom: ".5em" }}>
            {this.renderQuizzes()}
          </div>

          <div className="border-b border-gray-300 my-4"></div>

          <div className="container">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-teal-500">My Flashcard Decks</p>
              <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:border-transparent hover:text-white hover:bg-indigo-500 lg:mt-0">
                New Flashcard Deck
              </button>
            </div>
          </div>
          <div style={{ paddingTop: ".5em", paddingBottom: ".5em" }}>
            {this.renderFlashcardDecks()}
          </div>
        </div>

        <Modal
          isOpen={this.state.quizModal}
          onRequestClose={e => this.closeModal("quizModal")}
          style={modalStyles}
          contentLabel="quiz modal"
          key="quizModal"
        >
          <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 max-w-xl mx-auto">
            {this.state.quiz}
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Creations;
