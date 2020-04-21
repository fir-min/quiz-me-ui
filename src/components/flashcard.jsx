import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import QuizMeService from "../services/quizMeService";
import { apiWrapper } from "../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";

const maxQuestionLength = 100;

const maxAnswerLength = 100;

class Flashcard extends Component {
  static contextType = GlobalContext;

  state = {
    flashcard: undefined,
    questionCharactersCount: maxQuestionLength,
    answerCharactersCount: maxAnswerLength,
    flipped: false,
  };

  constructor(props, context) {
    super(props, context);
    console.log(props.flashcard);
    if (props.flashcard) {
      console.log("booya");
      let tmp = props.flashcard;

      let _state = this.state;
      _state.flashcardObj = props.flashcard;
      _state.question = tmp.question;
      _state.answer = tmp.answer;
      _state.answerCharactersCount = maxAnswerLength - tmp.answer.length;
      _state.questionCharactersCount = maxQuestionLength - tmp.question.length;
      this.state = _state;
    }
  }

  handleQuestion = (e) => {
    let value = e.target.value;
    let count = maxQuestionLength - value.length;
    if (count < 0) {
      count = 0;
    } else {
      this.setState({
        question: value,
      });
    }
    this.setState({ questionCharactersCount: count });
  };

  handleAnswer = (e) => {
    let value = e.target.value;
    let count = maxAnswerLength - value.length;
    if (count < 0) {
      count = 0;
    } else {
      this.setState({
        answer: value,
      });
    }
    this.setState({ answerCharactersCount: count });
  };

  deleteFlashcard = () => {
    const req = {
      flashcard_id: this.state.flashcardObj.id,
      token: this.context.user.token,
    };
    this.context.modals.openWarningModal(
      "Are you sure you want to delete this? This action cannot be undone.",
      async () => {
        await this.context.utils.loaderWrapper(() => {
          apiWrapper(
            QuizMeService.deleteFlashcard,
            req,
            (json) => {
              let _state = this.state;
              _state.flashcard = undefined;
              this.props.onDeleted();
              this.setState(_state);
            },
            this.context.modals.openErrorModal,
            this.context.user.logout
          );
        });
      }
    );
  };

  renderFlashcardEdit = () => {
    return (
      <React.Fragment>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Flashcard
          </label>
          <textarea
            className="shadow appearance-none border rounded lg:w-118 xl:w-118 md:w-118 w-104 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={this.state.question}
            placeholder="Question"
            aria-label="question"
            onChange={(e) => this.handleQuestion(e)}
          />
          <p className={`text-sm italic text-gray-400`}>
            {`${this.state.questionCharactersCount} characters left`}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Answer
          </label>
          <textarea
            className="shadow appearance-none border rounded lg:w-118 xl:w-118 md:w-118 w-104 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={this.state.answer}
            placeholder="Answer"
            aria-label="answer"
            onChange={(e) => this.handleAnswer(e)}
          />
          <p className={`text-sm italic text-gray-400`}>
            {`${this.state.answerCharactersCount} characters left`}
          </p>
        </div>

        <div className="flex justify-end">{this.getEditOrCreateButton()}</div>
      </React.Fragment>
    );
  };

  renderFlashcardStudy = () => {
    return (
      <React.Fragment>
        <div className="p-6 m-6">
          <div className="flex justify-center">
            <p className="block text-indigo-700 text-lg font-bold mb-4">
              {this.state.flipped ? this.state.answer : this.state.question}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              className="text-indigo-500 text-lg lg"
              title="flip"
              onClick={(e) => this.flip()}
            >
              <FontAwesomeIcon
                icon={faRetweet}
                className="text-indigo-500 hover:text-teal-500"
              />
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  getEditOrCreateButton = () => {
    if (this.props.create) {
      return (
        <button
          className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
          onClick={(e) => this.createFlashcard()}
        >
          Create Flashcard
        </button>
      );
    } else if (this.props.edit) {
      return (
        <React.Fragment>
          <div className="flex justify-between mb-6">
            <button
              className="bg-indigo-500 mx-6 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
              onClick={() => this.deleteFlashcard()}
            >
              Delete Flashcard
            </button>
            <button
              className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
              onClick={(e) => this.saveFlashcard()}
            >
              Save Flashcard
            </button>
          </div>
        </React.Fragment>
      );
    }
  };

  createFlashcard = async () => {
    let req = {
      token: this.context.user.token,
      body: {
        flashcard_deck_id: this.props.flashcardDeckId,
        answer: this.state.answer,
        question: this.state.question,
      },
    };

    //console.log(req);

    this.props.closeModal();

    this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.createFlashcard,
        req,
        (json) => {
          this.setState({ questionObj: json });
          this.props.onCreated(json);
        },
        (msg) => {
          this.context.modals.openErrorModal(msg);
        },
        this.context.user.logout
      );
    });
  };

  saveFlashcard = async () => {
    let req = {
      token: this.context.user.token,
      body: {
        id: this.state.flashcardObj.id,
        question: this.state.question,
        answer: this.state.answer,
      },
    };

    this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.editFlashcard,
        req,
        (json) => {
          this.setState({ flashcardObj: json });
          this.props.onUpdated(json);
        },
        (msg) => {
          this.context.modals.openErrorModal(msg);
        },
        this.context.user.logout
      );
    });
  };

  flip = () => {
    this.setState({ flipped: !this.state.flipped });
  };

  render() {
    return (
      <React.Fragment>
        <div className="w-full">
          {this.props.study
            ? this.renderFlashcardStudy()
            : this.renderFlashcardEdit()}
        </div>
      </React.Fragment>
    );
  }
}

export default Flashcard;
