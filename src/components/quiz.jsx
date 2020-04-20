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
    border: "none",
  },
};

Modal.setAppElement("#root");

class Quiz extends Component {
  static contextType = GlobalContext;

  constructor(props, context) {
    super(props, context);

    let quizId = props.match ? props.match.params.quizId : undefined;

    this.state = {
      currentQuestionIndex: 0,
      nextQuestionIndex: 0,
      previousQuestionIndex: 0,
      create: props.create,
      edit: props.location.pathname.split("/").pop() === "edit" ? true : false,
      study:
        props.location.pathname.split("/").pop() === "study" ? true : false,
      name: props.quiz ? props.quiz.name : undefined,
      description: props.quiz ? props.quiz.description : undefined,
      descriptionCharactersCount: maxDescriptionLength,
      nameCharactersCount: maxNameLength,
      quiz: props.quiz,
      id: quizId,
    };

    //this.loadQuiz();

    if (quizId) {
      console.log("found quiz id");
      this.loadQuiz();
    }

    //this.renderQuestions = this.renderQuestions.bind(this);
  }

  componentDidMount() {}

  loadQuiz = async () => {
    await this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.getQuiz, // method to call
        {
          quiz_id: this.state.id,
          token: this.context.user.token,
        },
        (json) => {
          // on success
          console.log("quiz loaded");
          console.log(json);
          console.log("updated state");
          this.setState({
            quiz: json,
            nameCharactersCount: maxNameLength - json.name.length,
            descriptionCharactersCount:
              maxDescriptionLength - json.description.length,
            name: json.name,
            description: json.description,
          });
        },
        this.context.modals.openErrorModal, // on error
        this.context.user.logout // on authorized
      );
    });

    console.log(this.state);
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  handleDescription = (e) => {
    let value = e.target.value;
    let count = maxDescriptionLength - value.length;
    if (count < 0) {
      this.setState({
        description: value.substring(0, maxDescriptionLength).trimEnd(),
      });
      count = 0;
    } else {
      this.setState({
        description: value,
      });
    }

    this.setState({ descriptionCharactersCount: count });
  };

  handleName = (e) => {
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
        description: this.state.description,
      },
    };
    this.props.onCreated();

    await this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.createQuiz,
        req,
        (json) => {
          this.redirectToEdit(json.id);
        },
        (msg) => {
          this.context.modals.openErrorModal(msg);
        },
        this.context.user.logout
      );
    });
  };

  editQuiz = async () => {
    const req = {
      token: this.context.user.token,
      body: {
        id: this.state.quiz.id,
        name: this.state.name,
        description: this.state.description,
      },
    };

    await this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.editQuiz,
        req,
        (json) => {
          this.setState({ quiz: json });
          this.setState({ name: json.name });
          this.setState({ description: json.description });
          this.context.modals.openMessageModal("Successfully updated quiz.");
        },
        (msg) => {
          this.context.modals.openErrorModal(msg);
        },
        this.context.user.logout
      );
    });
  };

  redirectToEdit = (id) => {
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
                onChange={(e) => this.handleName(e)}
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
                onChange={(e) => this.handleDescription(e)}
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
                onClick={(e) => this.createQuiz()}
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
          <Question
            create={true}
            quizId={this.state.quiz.id}
            closeModal={() => {
              this.setState({ showQuestionModal: false });
            }}
            onCreated={(question) => {
              let q = this.state.quiz;
              q.questions.push(question);
              this.setState({ quiz: q });
            }}
          ></Question>
        </React.Fragment>
      ),
    });
  };

  renderQuestion = (idx) => {
    if (!this.state.quiz) {
      return <React.Fragment></React.Fragment>;
    }

    if (idx >= this.state.quiz.questions.length) {
      return (
        <div className="px-4 py-4 my-32 shadow-lg rounded-lg text-xl text-bold text-teal-700">
          End of quiz!
        </div>
      );
    }

    if (idx < 0) {
      idx = 0;
    }

    let question = this.state.quiz.questions[idx];
    return (
      <div className="px-4 my-6 py-4 shadow-lg rounded-lg">
        <Question
          edit={this.state.edit}
          study={this.state.study}
          question={question}
          key={question.id}
        ></Question>
      </div>
    );
  };

  renderQuestions = () => {
    if (!this.state.quiz) {
      return <React.Fragment></React.Fragment>;
    }
    console.log("rendering questions");
    console.log("this.state.quiz.questions");
    console.log(this.state.quiz.questions);
    return (
      <div>
        {this.state.quiz.questions.map((it) => {
          return (
            <div className="px-4 my-6 py-4 shadow-md rounded-lg">
              <Question
                edit={this.state.edit}
                study={this.state.study}
                question={it}
                key={it.id}
                onUpdated={(q) => {
                  let quiz = this.state.quiz;
                  let questions = this.state.quiz.questions;
                  let idx = questions.indexOf(it);
                  questions[idx] = q;
                  quiz.questions = questions;
                  this.setState({ quiz: quiz });
                }}
                onDeleted={() => {
                  let quiz = this.state.quiz;
                  let questions = this.state.quiz.questions;
                  quiz.questions = questions.filter((q) => q.id !== it.id);
                  this.setState({ quiz: quiz });
                }}
              ></Question>
            </div>
          );
        })}
      </div>
    );
  };

  edit = () => {
    if (this.state.edit) {
      console.log("edit ***");
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
                onChange={(e) => this.handleName(e)}
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
                onChange={(e) => this.handleDescription(e)}
              />
              <p className={`text-sm italic text-gray-400`}>
                {this.state.descriptionCharactersCount} characters left
              </p>
            </div>
            <div className="flex justify-between mb-6">
              <button
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
                onClick={(e) => this.createQuestion()}
              >
                Add Question
              </button>

              <button
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
                onClick={(e) => this.editQuiz()}
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
    return <React.Fragment></React.Fragment>;
  };

  goToPrevQuestion = () => {
    if (this.state.currentQuestionIndex >= 1) {
      this.setState({
        currentQuestionIndex: this.state.currentQuestionIndex - 1,
      });
    }
  };

  study = () => {
    if (this.state.study) {
      console.log("study ***");
      return (
        <div className="mx-auto">
          <div className="w-full">
            <div className="mb-4">
              <p className="block text-indigo-700 text-md font-bold mb-2">
                {this.state.name}
              </p>
            </div>
            <div className="mb-4">
              <p className="block text-gray-700 text-sm font-bold mb-2">
                {this.state.description}
              </p>
            </div>

            <div className="flex justify-between">
              <div className="mt-32">
                <button
                  className="bg-teal-500 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline hover:bg-teal-600"
                  onClick={(e) => this.goToPrevQuestion()}
                >
                  Previous
                </button>
              </div>
              <div className="my-2 h-screen lg:overflow-y-auto xl:overflow-y-auto w-auto px-2">
                {this.renderQuestion(this.state.currentQuestionIndex)}
              </div>
              <div className="mt-32">
                <button
                  className="bg-teal-500 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline hover:bg-teal-600"
                  onClick={(e) => {
                    this.setState({
                      currentQuestionIndex: this.state.currentQuestionIndex + 1,
                    });
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <React.Fragment></React.Fragment>;
  };

  headers = () => {
    if (this.state.create) {
      return (
        <React.Fragment>
          <h3 className="text-teal-500 font-semibold mb-2">Create Quiz</h3>
        </React.Fragment>
      );
    }

    if (this.state.edit) {
      return (
        <React.Fragment>
          <h3 className="text-teal-500 font-semibold mb-2">Edit Quiz</h3>
        </React.Fragment>
      );
    }

    if (this.state.study) {
      return (
        <React.Fragment>
          <h3 className="text-teal-500 font-semibold mb-2">Take Quiz</h3>
        </React.Fragment>
      );
    }

    return <React.Fragment>headers</React.Fragment>;
  };

  render() {
    return (
      <React.Fragment>
        {this.headers()}
        {this.create()}
        {this.study()}
        {this.edit()}

        <Modal
          isOpen={this.state.showQuestionModal}
          onRequestClose={(e) => this.setState({ showQuestionModal: false })}
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
