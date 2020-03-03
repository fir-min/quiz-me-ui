import React, { Component } from "react";
import QuizMeService from "../services/quizMeService";
import { apiWrapper } from "../common/utils";
import { withRouter } from "react-router-dom";
import GlobalContext from "./contexts/globalContext";

const maxDescriptionLength = 100;

const maxNameLength = 35;

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
      descriptionWarning: "",
      nameWarning: "",
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
    console.log(this.state);
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  handleDescription = e => {
    let value = e.target.value;
    let count = maxDescriptionLength - value.length;
    if (count < 0) {
      this.setState({ descriptionWarning: "text-red-500 font-semibold" });
    } else {
      this.setState({ descriptionWarning: "" });
    }

    this.setState({ descriptionCharactersCount: count });
    this.setState({
      description: value.substring(0, maxDescriptionLength).trim()
    });
  };

  handleName = e => {
    let value = e.target.value;
    let count = maxNameLength - value.length;
    if (count < 0) {
      this.setState({ nameWarning: "text-red-500 font-semibold" });
    } else {
      this.setState({ nameWarning: "" });
    }

    this.setState({ nameCharactersCount: count });
    this.setState({ name: value.substring(0, maxNameLength).trim() });
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
                placeholder="Quiz Name"
                aria-label="quiz name"
                onChange={e => this.handleName(e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${this.state.nameWarning}`}
              >{`${this.state.nameCharactersCount} characters left`}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                placeholder="Quiz Description"
                aria-label="quiz description"
                onChange={e => this.handleDescription(e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${this.state.descriptionWarning}`}
              >{`${this.state.descriptionCharactersCount} characters left`}</p>
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

  saveQuiz = () => {
    this.context.modals.openErrorModal("blah");
  };

  edit = () => {
    if (this.state.edit) {
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
                value={this.state.quiz.name}
                aria-label="quiz name"
                onChange={e => this.handleName(e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${this.state.nameWarning}`}
              >{`${this.state.nameCharactersCount} characters left`}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                value={this.state.quiz.description}
                aria-label="quiz description"
                onChange={e => this.handleDescription(e)}
              />
              <p
                className={`text-sm italic text-gray-400 ${this.state.descriptionWarning}`}
              >{`${this.state.descriptionCharactersCount} characters left`}</p>
            </div>
            <div>questions will be here</div>
            <div className="flex justify-end">
              <button
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
                onClick={e => this.createQuiz()}
              >
                Save Quiz
              </button>
            </div>
          </div>
        </React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default withRouter(Quiz);
