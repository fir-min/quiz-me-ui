import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import QuizMeService from "../services/quizMeService";
import { apiWrapper } from "../common/utils";

const maxQuestionLength = 100;

const singleAnswer = "SINGLE_ANSWER";

const multiAnswer = "MULTI_ANSWER";

const maxAnswerLength = 75;

class Question extends Component {
  static contextType = GlobalContext;

  state = {
    checkboxChecked: false,
    questionObj: {},
    question: undefined,
    questionType: singleAnswer,
    questionCharactersCount: maxQuestionLength,
    answerOneCheckboxSelected: false,
    answerTwoCheckboxSelected: false,
    answerThreeCheckboxSelected: false,
    answerFourCheckboxSelected: false,
    answerOne: { value: undefined, is_correct: false, count: maxAnswerLength },
    answerTwo: { value: undefined, is_correct: false, count: maxAnswerLength },
    answerThree: {
      value: undefined,
      is_correct: false,
      count: maxAnswerLength
    },
    answerFour: { value: undefined, is_correct: false, count: maxAnswerLength }
  };

  constructor(props, context) {
    super(props, context);
    console.log("question prop");
    console.log(props.question);
    if (props.question) {
      console.log("booya");
      let tmp = props.question;

      let _state = this.state;
      _state["questionObj"] = props.question;
      _state.question = tmp.question;
      _state.questionType = tmp.question_type;
      _state.answerOne = {
        value: tmp.answers[0].value,
        is_correct: tmp.answers[0].is_correct,
        count: maxAnswerLength - tmp.answers[0].value.length
      };

      _state.answerTwo = {
        value: tmp.answers[1].value,
        is_correct: tmp.answers[1].is_correct,
        count: maxAnswerLength - tmp.answers[1].value.length
      };

      _state.answerThree = {
        value: tmp.answers[2].value,
        is_correct: tmp.answers[2].is_correct,
        count: maxAnswerLength - tmp.answers[2].value.length
      };

      _state.answerFour = {
        value: tmp.answers[3].value,
        is_correct: tmp.answers[3].is_correct,
        count: maxAnswerLength - tmp.answers[3].value.length
      };

      this.state = _state;
    }
  }

  handleQuestion = e => {
    let value = e.target.value;
    let count = maxQuestionLength - value.length;
    if (count < 0) {
      this.setState({
        description: value.substring(0, maxQuestionLength).trimEnd()
      });
      count = 0;
    } else {
      this.setState({
        question: value
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

  handleQuestionType = questionType => {
    this.setState({ questionType: questionType });
    let answers = ["answerOne", "answerTwo", "answerThree", "answerFour"];
    answers.map(it => {
      let answer = this.state[it];
      answer.is_correct = false;
      this.setState({ [it]: answer });
    });
  };

  validateAtLeastOneAnswerIsMarkedCorrect = () => {
    let answers = ["answerOne", "answerTwo", "answerThree", "answerFour"];
    return answers.some(it => {
      let answer = this.state[it];
      if (answer.is_correct) {
        return true;
      }
      return false;
    });
  };

  handleChecked = name => {
    let answer = this.state[name];
    let change = !answer.is_correct;
    console.log(change + " **");

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
      this.setState({ checkboxChecked: !this.state.checkboxChecked });
    }
  };

  renderQuestion = () => {
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
            onChange={e => this.handleQuestion(e)}
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
              onChange={e => this.handleQuestionType(singleAnswer)}
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
              onChange={e => this.handleQuestionType(multiAnswer)}
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
                onChange={e => this.handleAnswerChange("answerOne", e)}
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
                onChange={e => this.handleChecked("answerOne")}
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
                onChange={e => this.handleAnswerChange("answerTwo", e)}
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
                onChange={e => this.handleChecked("answerTwo")}
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
                onChange={e => this.handleAnswerChange("answerThree", e)}
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
                onChange={e => this.handleChecked("answerThree")}
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
                onChange={e => this.handleAnswerChange("answerFour", e)}
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
                onChange={e => this.handleChecked("answerFour")}
              />
              Correct
            </label>
          </div>
        </div>

        <div className="flex justify-end">{this.getEditOrCreateButton()}</div>
      </React.Fragment>
    );
  };

  getEditOrCreateButton = () => {
    if (this.props.create) {
      return (
        <button
          className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
          onClick={e => this.createQuestion()}
        >
          Create Question
        </button>
      );
    } else if (this.props.edit) {
      return (
        <button
          className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
          onClick={e => this.saveQuestion()}
        >
          Save Question
        </button>
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
        answers: answers.map(it => {
          let answer = this.state[it];
          return {
            value: answer.value,
            is_correct: answer.is_correct
          };
        })
      }
    };

    console.log(req);
    await apiWrapper(
      QuizMeService.createQuestion,
      req,
      json => {
        this.setState({ questionObj: json });
      },
      msg => {
        this.context.modals.openErrorModal(msg);
      },
      this.context.user.logout
    );
  };

  render() {
    return <div className="w-full firmin">{this.renderQuestion()}</div>;
  }
}

export default Question;
