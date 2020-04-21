import React, { Component } from "react";
import QuizMeService from "../services/quizMeService";
import { apiWrapper } from "../common/utils";
import { withRouter } from "react-router-dom";
import GlobalContext from "./contexts/globalContext";
import Modal from "react-modal";
import Flashcard from "./flashcard";

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

class FlashcardDeck extends Component {
  static contextType = GlobalContext;

  constructor(props, context) {
    super(props, context);

    let flashcardDeckId = props.match
      ? props.match.params.flashcardDeckId
      : undefined;

    this.state = {
      currentFlashcardIndex: 0,
      nextQuestionIndex: 0,
      previousQuestionIndex: 0,
      create: props.create,
      edit: props.location.pathname.split("/").pop() === "edit" ? true : false,
      study:
        props.location.pathname.split("/").pop() === "study" ? true : false,
      name: props.flashcardDeck ? props.flashcardDeck.name : undefined,
      description: props.flashcardDeck
        ? props.flashcardDeck.description
        : undefined,
      descriptionCharactersCount: maxDescriptionLength,
      nameCharactersCount: maxNameLength,
      flashcardDeck: props.flashcardDeck,
      id: flashcardDeckId,
    };

    if (flashcardDeckId) {
      console.log("found deck id");
      this.loadFlashcardDeck();
    }

    //this.renderQuestions = this.renderQuestions.bind(this);
  }

  componentDidMount() {}

  loadFlashcardDeck = async () => {
    await this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.getFlashcardDeck, // method to call
        {
          flashcard_deck_id: this.state.id,
          token: this.context.user.token,
        },
        (json) => {
          // on success
          this.setState({
            flashcardDeck: json,
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

  createFlashcardDeck = async () => {
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
        QuizMeService.createFlashcardDeck,
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

  editFlashcardDeck = async () => {
    const req = {
      token: this.context.user.token,
      body: {
        id: this.state.flashcardDeck.id,
        name: this.state.name,
        description: this.state.description,
      },
    };

    await this.context.utils.loaderWrapper(() => {
      apiWrapper(
        QuizMeService.editFlashcardDeck,
        req,
        (json) => {
          this.setState({ quiz: json });
          this.setState({ name: json.name });
          this.setState({ description: json.description });
          this.context.modals.openMessageModal("Successfully updated deck.");
        },
        (msg) => {
          this.context.modals.openErrorModal(msg);
        },
        this.context.user.logout
      );
    });
  };

  redirectToEdit = (id) => {
    this.props.history.push(`/flashcard-deck/${id}/edit`);
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
                placeholder="Name"
                aria-label="name"
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
                placeholder="Description"
                aria-label="description"
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
                onClick={(e) => this.createFlashcardDeck()}
              >
                Create Flashcard Deck
              </button>
            </div>
          </div>
        </React.Fragment>
      );
    }
  };

  createFlashcard = () => {
    this.setState({ showFlashcardModal: true });
    this.setState({
      flashcard: (
        <React.Fragment>
          <Flashcard
            create={true}
            flashcardDeckId={this.state.flashcardDeck.id}
            closeModal={() => {
              this.setState({ showFlashcardModal: false });
            }}
            onCreated={(flashcard) => {
              let q = this.state.flashcardDeck;
              q.flashcards.push(flashcard);
              this.setState({ flashcardDeck: q });
            }}
          ></Flashcard>
        </React.Fragment>
      ),
    });
  };

  renderFlashcard = (idx) => {
    if (!this.state.flashcardDeck) {
      return <React.Fragment></React.Fragment>;
    }

    if (idx >= this.state.flashcardDeck.flashcards.length) {
      return (
        <div className="px-4 py-4 my-32 shadow-lg rounded-lg text-xl text-bold text-teal-700">
          You've reached the end!
        </div>
      );
    }

    if (idx < 0) {
      idx = 0;
    }

    let flashcard = this.state.flashcardDeck.flashcards[idx];
    return (
      <div className="px-4 my-6 py-4 shadow-lg rounded-lg">
        <Flashcard
          edit={this.state.edit}
          study={this.state.study}
          flashcard={flashcard}
          key={flashcard.id}
        ></Flashcard>
      </div>
    );
  };

  renderFlashcards = () => {
    if (!this.state.flashcardDeck) {
      return <React.Fragment></React.Fragment>;
    }

    console.log(this.state.flashcardDeck.flashcards);
    return (
      <div>
        {this.state.flashcardDeck.flashcards.map((it) => {
          return (
            <div className="px-4 my-6 py-4 shadow-md rounded-lg">
              <Flashcard
                edit={this.state.edit}
                study={this.state.study}
                flashcard={it}
                key={it.id}
                onUpdated={(f) => {
                  let flashcardDeck = this.state.flashcardDeck;
                  let flashcards = this.state.flashcardDeck.flashcards;
                  let idx = flashcards.indexOf(it);
                  flashcards[idx] = f;
                  flashcardDeck.flashcards = flashcards;
                  this.setState({ flashcardDeck: flashcardDeck });
                }}
                onDeleted={() => {
                  let flashcardDeck = this.state.flashcardDeck;
                  let flashcards = this.state.flashcardDeck.flashcards;
                  flashcardDeck.flashcards = flashcards.filter(
                    (f) => f.id !== it.id
                  );
                  this.setState({ flashcardDeck: flashcardDeck });
                }}
              ></Flashcard>
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
                onClick={(e) => this.createFlashcard()}
              >
                Add Flashcard
              </button>

              <button
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-600"
                onClick={(e) => this.editFlashcardDeck()}
              >
                Save
              </button>
            </div>
            <div className="my-2 h-screen lg:overflow-y-auto xl:overflow-y-auto lg:mx-40 xl:mx-72 lg:px-4 xl:px-4 md:px-4 w-auto">
              {this.renderFlashcards()}
            </div>
          </div>
        </div>
      );
    }
    return <React.Fragment></React.Fragment>;
  };

  goToPrev = () => {
    if (this.state.currentFlashcardIndex >= 1) {
      this.setState({
        currentFlashcardIndex: this.state.currentFlashcardIndex - 1,
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
                  onClick={(e) => this.goToPrev()}
                >
                  Previous
                </button>
              </div>
              <div className="my-2 h-screen lg:overflow-y-auto xl:overflow-y-auto w-auto px-2">
                {this.renderFlashcard(this.state.currentFlashcardIndex)}
              </div>
              <div className="mt-32">
                <button
                  className="bg-teal-500 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline hover:bg-teal-600"
                  onClick={(e) => {
                    this.setState({
                      currentFlashcardIndex:
                        this.state.currentFlashcardIndex + 1,
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
          <h3 className="text-teal-500 font-semibold mb-2">
            Create Flashcard Deck
          </h3>
        </React.Fragment>
      );
    }

    if (this.state.edit) {
      return (
        <React.Fragment>
          <h3 className="text-teal-500 font-semibold mb-2">
            Edit Flashcard Deck
          </h3>
        </React.Fragment>
      );
    }

    if (this.state.study) {
      return (
        <React.Fragment>
          <h3 className="text-teal-500 font-semibold mb-2">Study</h3>
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
          isOpen={this.state.showFlashcardModal}
          onRequestClose={(e) => this.setState({ showFlashcardModal: false })}
          style={modalStyles}
          contentLabel="flashcard modal"
          key="flashcardDeckModal"
        >
          <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 max-w-lg mx-auto">
            {this.state.flashcard}
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(FlashcardDeck);
