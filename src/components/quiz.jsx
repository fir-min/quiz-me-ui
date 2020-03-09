import React, { Component } from "react";
import QuizMeService from "../services/quizMeService";
import { apiWrapper } from "../common/utils";
import { withRouter } from "react-router-dom";
import GlobalContext from "./contexts/globalContext";
import Question from "./question";
import Modal from "react-modal";

const maxDescriptionLength = 100;

const maxNameLength = 35;

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
    border: "none"
  }
};

Modal.setAppElement("#root");

class Quiz extends Component {
  static contextType = GlobalContext;

  state = {
    currentQuestionIndex: 0,
    nextQuestionIndex: 0,
    previousQuestionIndex: 0,
    create: false,
    edit: false,
    name: undefined,
    description: undefined,
    descriptionCharactersCount: maxDescriptionLength,
    nameCharactersCount: maxNameLength,
    descriptionWarning: "",
    nameWarning: "",
    quiz: undefined,
    id: undefined
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentQuestionIndex: 0,
      nextQuestionIndex: 0,
      previousQuestionIndex: 0,
      create: props.create,
      edit: props.edit,
      name: props.quiz ? props.quiz.name : undefined,
      description: props.quiz ? props.quiz.description : undefined,
      descriptionCharactersCount: maxDescriptionLength,
      nameCharactersCount: maxNameLength,
      quiz: props.quiz,
      id: props.match ? props.match.params.quizId : undefined
    };

    if (this.state.id) {
      this.loadQuiz();
    }
  }

  loadQuiz = async () => {
    await apiWrapper(
      QuizMeService.getQuiz, // method to call
      {
        quizId: this.state.id,
        token: this.context.user.token
      },
      json => {
        // on success
        this.setState({ quiz: json });
      },
      this.context.modals.openErrorModal, // on error
      this.context.user.logout // on authorized
    );

    this.setState({ edit: true });
    this.setState({
      nameCharactersCount: maxNameLength - this.state.quiz.name.length
    });
    this.setState({
      descriptionCharactersCount:
        maxDescriptionLength - this.state.quiz.description.length
    });

    this.setState({ name: this.state.quiz.name });
    this.setState({ description: this.state.quiz.description });
    console.log(this.state);
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  handleDescription = e => {
    let value = e.target.value;
    let count = maxDescriptionLength - value.length;
    if (count < 0) {
      this.setState({
        description: value.substring(0, maxDescriptionLength).trimEnd()
      });
      count = 0;
    } else {
      this.setState({
        description: value
      });
    }

    this.setState({ descriptionCharactersCount: count });
  };

  handleName = e => {
    let value = e.target.value;
    let count = maxNameLength - value.length;
    if (count < 0) {
      this.setState({ name: value.substring(0, maxNameLength).trimEnd() });
      count = 0;
    } else {
      this.setState({ name: value });
    }

    this.setState({ nameCharactersCount: count });
  };

  createQuiz = async () => {
    const req = {
      token: this.context.user.token,
      body: {
        user_id: this.context.user.id,
        name: this.state.name,
        description: this.state.description
      }
    };
    await apiWrapper(
      QuizMeService.createQuiz,
      req,
      json => {
        this.redirectToEdit(json.id);
      },
      msg => {
        this.context.modals.openErrorModal(msg);
      },
      this.context.user.logout
    );
  };

  editQuiz = async () => {
    const req = {
      token: this.context.user.token,
      body: {
        id: this.state.quiz.id,
        name: this.state.name,
        description: this.state.description
      }
    };

    await apiWrapper(
      QuizMeService.editQuiz,
      req,
      json => {
        this.setState({ quiz: json });
        this.setState({ name: json.name });
        this.setState({ description: json.description });
        this.context.modals.openMessageModal("Successfully updated quiz.");
      },
      msg => {
        this.context.modals.openErrorModal(msg);
      },
      this.context.user.logout
    );
  };

  redirectToEdit = id => {
    this.props.history.push(`/quiz/${id}/edit`);
  };

  create = () => {
    if (this.state.create) {
      return (
        <React.Fragment>
          <div className="w-full">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={this.state.name}
                placeholder="Quiz Name"
                aria-label="quiz name"
                onChange={e => this.handleName(e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${
                  this.state.nameCharactersCount < 0
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
              >
                {this.state.nameCharactersCount < 0
                  ? "Too many characters"
                  : `${this.state.nameCharactersCount} characters left`}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                value={this.state.description}
                type="text"
                placeholder="Quiz Description"
                aria-label="quiz description"
                onChange={e => this.handleDescription(e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${
                  this.state.descriptionCharactersCount < 0
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
              >
                {this.state.descriptionCharactersCount < 0
                  ? "Too many characters"
                  : `${this.state.descriptionCharactersCount} characters left`}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
                onClick={e => this.createQuiz()}
              >
                Create Quiz
              </button>
            </div>
          </div>
        </React.Fragment>
      );
    }
  };

  createQuestion = () => {
    this.setState({ showQuestionModal: true });
    this.setState({
      question: (
        <React.Fragment>
          <Question create={true} quizId={this.state.quiz.id}></Question>
        </React.Fragment>
      )
    });
  };

  renderQuestions = () => {
    return (
      <div className="">
        {this.state.quiz.questions.map(it => {
          return (
            <div className="px-4 my-6 py-4 shadow-md rounded-lg">
              <Question edit question={it} key={it.id}></Question>{" "}
            </div>
          );
        })}
      </div>
    );
  };

  edit = () => {
    if (this.state.edit) {
      return (
        <div className="mx-auto">
          <div className="w-full">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={this.state.name}
                aria-label="quiz name"
                onChange={e => this.handleName(e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${
                  this.state.nameCharactersCount < 0
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
              >
                {this.state.nameCharactersCount < 0
                  ? "Too many characters"
                  : `${this.state.nameCharactersCount} characters left`}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                value={this.state.description}
                aria-label="quiz description"
                onChange={e => this.handleDescription(e)}
              />
              <p className={`text-sm italic text-gray-400`}>
                `${this.state.descriptionCharactersCount} characters left`}
              </p>
            </div>
            <div className="flex justify-between mb-6">
              <button
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
                onClick={e => this.createQuestion()}
              >
                Add Question
              </button>

              <button
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
                onClick={e => this.editQuiz()}
              >
                Save Quiz
              </button>
            </div>
            <div className="my-2 h-screen lg:overflow-y-auto xl:overflow-y-auto lg:mx-40 xl:mx-72 lg:px-4 xl:px-4 md:px-4 w-auto">
              {this.renderQuestions()}
            </div>
          </div>
        </div>
      );
    }
  };

  view = () => {};

  study = () => {};

  headers = () => {
    if (this.state.create) {
      return (
        <React.Fragment>
          <h3 className="text-teal-500 font-semibold mb-2">Create Quiz</h3>
        </React.Fragment>
      );
    }

    return <React.Fragment></React.Fragment>;
  };

  render() {
    return (
      <React.Fragment>
        {this.headers()}
        {this.create()}
        {this.view()}
        {this.study()}
        {this.edit()}

        <Modal
          isOpen={this.state.showQuestionModal}
          onRequestClose={e => this.setState({ showQuestionModal: false })}
          style={modalStyles}
          contentLabel="question modal"
          key="quizModal"
        >
          <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 max-w-lg mx-auto">
            {this.state.question}
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(Quiz);
