import React, { Component } from "react";
import QuizMeService from "../services/quizMeService";
import { apiWrapper } from "../common/utils";
import GlobalContext from "./contexts/globalContext";

class Quiz extends Component {
  static contextType = GlobalContext;

  constructor(props) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
      nextQuestionIndex: 0,
      previousQuestionIndex: 0,
      create: props.create,
      edit: props.edit,
      name: undefined,
      description: undefined,
      quiz: props.quiz
    };
    console.log("construct");
  }

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
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
        let _state = this.state;
        console.log("quiz create res");
        console.log(json);
        _state.quiz = json;
        _state.create = false;
        _state.edit = true;
        _state.quiz = json;
        this.setState(_state);
      },
      msg => {
        this.context.modals.openErrorModal(msg);
      },
      this.context.user.logout
    );
  };

  create = () => {
    if (this.state.create) {
      return (
        <React.Fragment>
          <div className="form my-2 my-lg-0" style={{ width: "100%" }}>
            <input
              style={{ width: "100%" }}
              className="form-control mr-sm-2 my-2"
              type="text"
              placeholder="Quiz Name"
              aria-label="quiz name"
              onChange={e => this.handleChange("name", e)}
            />
            <textarea
              style={{ width: "100%" }}
              className="form-control mr-sm-2 my-2"
              type="text"
              placeholder="Quiz Description"
              aria-label="quiz description"
              onChange={e => this.handleChange("description", e)}
            />
            <button
              className="btn btn-outline-info my-2 my-sm-0 ml-auto float-right"
              onClick={e => this.createQuiz()}
            >
              Create Quiz
            </button>
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
          <div className="form my-2 my-lg-0" style={{ width: "100%" }}>
            <input
              style={{ width: "100%" }}
              className="form-control mr-sm-2 my-2"
              type="text"
              placeholder="Quiz Name"
              aria-label="quiz name"
              value={this.state.quiz.name}
              onChange={e => this.handleChange("name", e)}
            />
            <textarea
              style={{ width: "100%" }}
              className="form-control mr-sm-2 my-2"
              type="text"
              placeholder="Quiz Description"
              aria-label="quiz description"
              value={this.state.quiz.description}
              onChange={e => this.handleChange("description", e)}
            />
            <div>questions will be here</div>
            <button
              className="btn btn-outline-info my-2 my-sm-0 ml-auto float-right"
              onClick={e => this.saveQuiz()}
            >
              Save Quiz
            </button>
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
          <h3 className="qm-text-primary">Create Quiz</h3>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <h2 className="qm-text-primary">{this.state.quiz.name}</h2>
        <h4 className="qm-text-primary">{this.state.quiz.description}</h4>
      </React.Fragment>
    );
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

export default Quiz;
