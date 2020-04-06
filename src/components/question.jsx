import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import Modal from "react-modal";
import QuizMeService from "../services/quizMeService";
import { apiWrapper, timeout, shuffle } from "../common/utils";

const maxQuestionLength = 100;

const singleAnswer = "SINGLE_ANSWER";

const multiAnswer = "MULTI_ANSWER";

const maxAnswerLength = 75;

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%",
    zIndex: "999",
    backgroundColor: "transparent",
    border: "none",
  },
};

class Question extends Component {
  static contextType = GlobalContext;

  state = {
    checkboxChecked: this.props.edit,
    questionObj: {},
    question: undefined,
    questionType: singleAnswer,
    questionCharactersCount: maxQuestionLength,
    answerOneCheckboxSelected: false,
    answerTwoCheckboxSelected: false,
    answerThreeCheckboxSelected: false,
    answerFourCheckboxSelected: false,
    answerOne: {
      value: undefined,
      is_correct: false,
      count: maxAnswerLength,
    },
    answerTwo: {
      value: undefined,
      is_correct: false,
      count: maxAnswerLength,
    },
    answerThree: {
      value: undefined,
      is_correct: false,
      count: maxAnswerLength,
    },
    answerFour: {
      value: undefined,
      is_correct: false,
      count: maxAnswerLength,
    },
  };

  constructor(props, context) {
    super(props, context);
    console.log("question prop");
    console.log(props.question);
    if (props.question) {
      console.log("booya");
      let tmp = props.question;

      let _state = this.state;
      _state.correctAnswer = [];
      _state.questionObj = props.question;
      _state.question = tmp.question;
      _state.questionType = tmp.question_type;
      _state.answerOne = {
        name: "answerOne",
        id: tmp.answers[0].id,
        value: tmp.answers[0].value,
        is_correct: tmp.answers[0].is_correct,
        count: maxAnswerLength - tmp.answers[0].value.length,
        selected: false,
      };

      _state.answerTwo = {
        name: "answerTwo",
        id: tmp.answers[1].id,
        value: tmp.answers[1].value,
        is_correct: tmp.answers[1].is_correct,
        count: maxAnswerLength - tmp.answers[1].value.length,
        selected: false,
      };

      _state.answerThree = {
        name: "answerThree",
        id: tmp.answers[2].id,
        value: tmp.answers[2].value,
        is_correct: tmp.answers[2].is_correct,
        count: maxAnswerLength - tmp.answers[2].value.length,
        selected: false,
      };

      _state.answerFour = {
        name: "answerFour",
        id: tmp.answers[3].id,
        value: tmp.answers[3].value,
        is_correct: tmp.answers[3].is_correct,
        count: maxAnswerLength - tmp.answers[3].value.length,
        selected: false,
      };

      _state.shuffledAnswers = shuffle([
        "answerOne",
        "answerTwo",
        "answerThree",
        "answerFour",
      ]);

      this.state = _state;
    }
  }

  handleQuestion = (e) => {
    let value = e.target.value;
    let count = maxQuestionLength - value.length;
    if (count < 0) {
      this.setState({
        description: value.substring(0, maxQuestionLength).trimEnd(),
      });
      count = 0;
    } else {
      this.setState({
        question: value,
      });
    }

    this.setState({ questionCharactersCount: count });
  };

  handleAnswerChange = (name, e) => {
    let answer = this.state[name];
    answer.value = e.target.value;
    answer.count = maxAnswerLength - answer.value.length;
    if (answer.count < 0) {
      answer.count = 0;
      answer.value = answer.value.substring(0, maxAnswerLength).trimEnd();
    }

    this.setState({ [name]: answer });
  };

  handleQuestionType = (questionType) => {
    this.setState({ questionType: questionType });
    this.state.shuffledAnswers.forEach((it) => {
      let answer = this.state[it];
      answer.is_correct = false;
      this.setState({ [it]: answer });
    });
  };

  validateAtLeastOneAnswerIsMarkedCorrect = () => {
    return this.state.shuffledAnswers.some((it) => {
      let answer = this.state[it];
      if (answer.is_correct) {
        return true;
      }
      return false;
    });
  };

  handleChecked = (name) => {
    let answer = this.state[name];
    let change = !answer.is_correct;
    console.log(change + " ** " + name);

    let setSingleAnswerTrue =
      change &&
      this.state.questionType === singleAnswer &&
      !this.state.checkboxChecked;

    let setSingleAnswerFalse =
      !change &&
      this.state.questionType === singleAnswer &&
      this.state.checkboxChecked;

    let setMultiAnswer = this.state.questionType === multiAnswer;

    if (setSingleAnswerTrue) {
      answer["is_correct"] = !answer["is_correct"];
      this.setState({ [name]: answer });
      this.setState({ checkboxChecked: true });
      return;
    } else if (setSingleAnswerFalse) {
      answer["is_correct"] = !answer["is_correct"];
      this.setState({ [name]: answer });
      this.setState({ checkboxChecked: false });
      return;
    } else if (setMultiAnswer) {
      answer["is_correct"] = !answer["is_correct"];
      this.setState({ [name]: answer });
      this.setState({ checkboxChecked: false });
    }
  };

  getAnswersArr = () => {
    let answer1 = this.state.answerOne;
    let answer2 = this.state.answerTwo;
    let answer3 = this.state.answerThree;
    let answer4 = this.state.answerFour;

    return [answer1, answer2, answer3, answer4];
  };

  setSelectedToFalse = () => {
    this.getAnswersArr()
      .map((it) => {
        it.selected = false;
        return it;
      })
      .forEach((it) => {
        this.setState({ [it.name]: it });
      });
  };

  handleCheckedStudy = (name, e) => {
    console.log("evemt");
    console.log(e.target);

    let answer = this.state[name];
    let change = !answer.selected;

    if (this.state.questionType === singleAnswer) {
      if (change && !this.state.checkboxChecked) {
        this.setSelectedToFalse();
        console.log(name);
        answer.selected = change;
        this.setState({ [name]: answer, checkboxChecked: true });
      } else {
        if (this.state.checkboxChecked && answer.selected === true) {
          console.log(name);
          answer.selected = change;
          this.setState({ [name]: answer, checkboxChecked: false });
        }
        if (this.state.checkboxChecked && answer.selected === false) {
          this.setSelectedToFalse();
          answer.selected = change;
          this.setState({ [name]: answer, checkboxChecked: false });
        }
      }
    } else {
      answer.selected = change;
      this.setState({ [name]: answer });
    }
  };

  deleteQuestion = () => {
    const req = {
      question_id: this.state.questionObj.id,
      token: this.context.user.token,
    };
    this.context.modals.openWarningModal(
      "Are you sure you want to delete this question? This action cannot be undone.",
      async () => {
        await this.context.utils.loaderWrapper(() => {
          apiWrapper(
            QuizMeService.deleteQuestion,
            req,
            (json) => {
              let _state = this.state;
              _state.question = undefined;
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

  renderQuestionEdit = () => {
    return (
      <React.Fragment>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Question
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

        <div className="mb-4 flex justify-between">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <input
              className="shadow border focus:outline-none focus:shadow-outline mx-2"
              id="type"
              value={singleAnswer}
              type="radio"
              checked={this.state.questionType === singleAnswer}
              aria-label="question type"
              onChange={(e) => this.handleQuestionType(singleAnswer)}
            />
            Single Answer
          </label>

          <label className="block text-gray-700 text-sm font-bold mb-2 mr-2">
            <input
              className="shadow border focus:outline-none focus:shadow-outline mx-2"
              id="type"
              value={multiAnswer}
              checked={this.state.questionType === multiAnswer}
              type="radio"
              aria-label="question type"
              onChange={(e) => this.handleQuestionType(multiAnswer)}
            />
            Multiple Answers
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Answer # 1
          </label>
          <div className="flex justify-between">
            <div>
              <textarea
                className="shadow appearance-none border rounded lg:w-96 xl:w-96 md:w-96 w-80 py-2 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={this.state.answerOne.value}
                type="text"
                placeholder="Answer"
                aria-label="Answer"
                onChange={(e) => this.handleAnswerChange("answerOne", e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${
                  this.state.answerOne.count < 0
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
              >
                {this.state.answerOne.count < 0
                  ? "Too many characters"
                  : `${this.state.answerOne.count} characters left`}
              </p>
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2 mr-2 my-4">
              <input
                className="shadow border focus:outline-none focus:shadow-outline mr-2"
                id="type"
                checked={this.state.answerOne["is_correct"]}
                type="checkbox"
                aria-label="correct answer"
                onChange={(e) => this.handleChecked("answerOne")}
              />
              Correct
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Answer # 2
          </label>
          <div className="flex justify-between">
            <div>
              <textarea
                className="shadow appearance-none border rounded lg:w-96 xl:w-96 md:w-96 w-80 py-2 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={this.state.answerTwo.value}
                type="text"
                placeholder="Answer"
                aria-label="Answer"
                onChange={(e) => this.handleAnswerChange("answerTwo", e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${
                  this.state.answerTwo.count < 0
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
              >
                {this.state.answerTwo.count < 0
                  ? "Too many characters"
                  : `${this.state.answerTwo.count} characters left`}
              </p>
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2 mr-2 my-4">
              <input
                className="shadow border focus:outline-none focus:shadow-outline mr-2"
                id="type"
                checked={this.state.answerTwo["is_correct"]}
                type="checkbox"
                aria-label="correct answer"
                onChange={(e) => this.handleChecked("answerTwo")}
              />
              Correct
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Answer # 3
          </label>
          <div className="flex justify-between">
            <div>
              <textarea
                className="shadow appearance-none border rounded lg:w-96 xl:w-96 md:w-96 w-80 py-2 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={this.state.answerThree.value}
                type="text"
                placeholder="Answer"
                aria-label="Answer"
                onChange={(e) => this.handleAnswerChange("answerThree", e)}
              />
              <p className={`text-sm italic text-gray-400`}>
                {`${this.state.answerThree.count} characters left`}
              </p>
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2 mr-2 my-4">
              <input
                className="shadow border focus:outline-none focus:shadow-outline mr-2"
                id="type"
                checked={this.state.answerThree["is_correct"]}
                type="checkbox"
                aria-label="correct answer"
                onChange={(e) => this.handleChecked("answerThree")}
              />
              Correct
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Answer # 4
          </label>
          <div className="flex justify-between">
            <div>
              <textarea
                className="shadow appearance-none border rounded lg:w-96 xl:w-96 md:w-96 w-80 py-2 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={this.state.answerFour.value}
                type="text"
                placeholder="Answer"
                aria-label="Answer"
                onChange={(e) => this.handleAnswerChange("answerFour", e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${
                  this.state.answerFour.count < 0
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
              >
                {this.state.answerFour.count < 0
                  ? "Too many characters"
                  : `${this.state.answerFour.count} characters left`}
              </p>
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2 mr-2 my-4">
              <input
                className="shadow border focus:outline-none focus:shadow-outline mr-2"
                id="type"
                checked={this.state.answerFour["is_correct"]}
                type="checkbox"
                aria-label="correct answer"
                onChange={(e) => this.handleChecked("answerFour")}
              />
              Correct
            </label>
          </div>
        </div>

        <div className="flex justify-end">{this.getEditOrCreateButton()}</div>
      </React.Fragment>
    );
  };

  renderAnswersStudy = () => {
    return (
      <React.Fragment>
        {this.state.shuffledAnswers.map((it) => {
          //let answer = this.state[it];
          return (
            <div className="flex justify-between">
              <input
                className="shadow border focus:outline-none focus:shadow-outline mr-2 mb-2"
                id="selected"
                type={
                  this.state.questionType === singleAnswer
                    ? "radio"
                    : "checkbox"
                }
                checked={this.state[it].selected}
                aria-label="selected answer"
                onChange={(e) => this.handleCheckedStudy(it, e)}
              />
              <p className="block text-gray-700 text-sm font-bold mb-2">
                {this.state[it].value}
              </p>
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  renderQuestionStudy = () => {
    return (
      <React.Fragment>
        <div className="mb-4">
          <p className="block text-indigo-700 text-md font-bold mb-2">
            {this.state.question}
          </p>
        </div>

        <p className="block text-indigo-500 text-sm font-semibold italic mb-2">
          {this.state.questionObj.question_type === "SINGLE_ANSWER"
            ? "Select the correct answer"
            : "Select the correct answers"}
        </p>

        <div className="mb-4">{this.renderAnswersStudy()}</div>

        <div className="flex justify-end">
          <button
            className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
            onClick={(e) => this.checkAnswer()}
          >
            Submit
          </button>
        </div>
      </React.Fragment>
    );
  };

  getEditOrCreateButton = () => {
    if (this.props.create) {
      return (
        <button
          className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
          onClick={(e) => this.createQuestion()}
        >
          Create Question
        </button>
      );
    } else if (this.props.edit) {
      return (
        <React.Fragment>
          <div className="flex justify-between mb-6">
            <button
              className="bg-indigo-500 mx-6 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
              onClick={() => this.deleteQuestion()}
            >
              Delete Question
            </button>
            <button
              className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
              onClick={(e) => this.saveQuestion()}
            >
              Save Question
            </button>
          </div>
        </React.Fragment>
      );
    }
  };

  createQuestion = async () => {
    let answers = ["answerOne", "answerTwo", "answerThree", "answerFour"];
    let req = {
      token: this.context.user.token,
      body: {
        quiz_id: this.props.quizId,
        question_type: this.state.questionType,
        question: this.state.question,
        answers: answers.map((it) => {
          let answer = this.state[it];
          return {
            value: answer.value,
            is_correct: answer.is_correct,
          };
        }),
      },
    };

    //console.log(req);

    this.props.closeModal();

    this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.createQuestion,
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

  saveQuestion = async () => {
    let answers = ["answerOne", "answerTwo", "answerThree", "answerFour"];
    let req = {
      token: this.context.user.token,
      body: {
        id: this.state.questionObj.id,
        question_type: this.state.questionType,
        question: this.state.question,
        answers: answers.map((it) => {
          let answer = this.state[it];
          return {
            value: answer.value,
            is_correct: answer.is_correct,
          };
        }),
      },
    };

    this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.editQuestion,
        req,
        (json) => {
          this.setState({ questionObj: json });
          this.props.onUpdated(json);
        },
        (msg) => {
          this.context.modals.openErrorModal(msg);
        },
        this.context.user.logout
      );
    });
  };

  checkAnswer = async () => {
    let selected = this.getAnswersArr().filter((it) => it.selected === true);
    if (this.state.questionType === singleAnswer) {
      let answer = selected[0];

      if (answer.is_correct) {
        this.setState({ showSuccessModal: true });
      } else {
        this.setState({ showFailureModal: true });
      }
    } else {
      let incorrect = selected.some((s) => {
        return s.is_correct === false;
      });
      if (incorrect) {
        this.setState({ showFailureModal: true });
      } else {
        this.setState({ showSuccessModal: true });
      }
    }
  };

  revealAnswer = () => {
    let correctAnswer = this.getAnswersArr()
      .filter((it) => it.is_correct === true)
      .map((it) => {
        let value = it.value;
        console.log(value);
        return value;
      });

    this.setState({ correctAnswer: correctAnswer });
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.showSuccessModal}
          onRequestClose={() => {
            this.setState({ showSuccessModal: false });
          }}
          contentLabel="question success modal"
          key="questionSuccessModal"
          style={modalStyles}
        >
          <div className="bg-gray-100 border-2 rounded-lg border-green-400 p-4">
            <p className="font-semibold text-green-500 text-center text-md">
              That's correct!
            </p>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.showFailureModal}
          onRequestClose={() => {
            this.setState({ showFailureModal: false });
          }}
          contentLabel="question failure modal"
          key="questionFailureModal"
          style={modalStyles}
        >
          <div className="bg-gray-100 border-2 rounded-lg border-yellow-400 p-4">
            <p className="font-semibold text-yellow-500 text-center text-md">
              That's not quite right...
            </p>

            <div className="text-gray-600 text-sm font-semibold">
              {this.state.correctAnswer.map((it) => {
                return (
                  <React.Fragment>
                    <p>{it}</p>
                    <br />
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex justify-end py-1 mr-4 mb-2">
              <button
                className="inline-block text-base px-4 py-2 leading-none rounded bg-yellow-500 text-white hover:bg-white hover:text-yellow-500 mr-4 lg:mt-0"
                type="submit"
                onClick={() => this.setState({ showFailureModal: false })}
              >
                Try Again
              </button>
              <button
                className="inline-block text-base px-4 py-2 leading-none rounded bg-yellow-500 text-white hover:bg-white hover:text-yellow-500 lg:mt-0"
                type="submit"
                onClick={() => this.revealAnswer()}
              >
                Reveal Answer
              </button>
            </div>
          </div>
        </Modal>

        <div className="w-full">
          {this.props.edit
            ? this.renderQuestionEdit()
            : this.renderQuestionStudy()}
        </div>
      </React.Fragment>
    );
  }
}

export default Question;
