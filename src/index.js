import React from "react";
import ReactDOM from "react-dom";
import "./css/tailwind.css";
import "./index.css";
import Main from "./components/main";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import NavBar from "./components/navbar";
import Global from "./components/global";
import Modals from "./components/modals";
import Search from "./components/search";
import Creations from "./components/creations";
import Container from "./components/container";
import Quiz from "./components/quiz";
import FlashcardDeck from "./components/flashcardDeck";

const routing = (
  <Modals>
    <Global>
      <Router>
        <NavBar></NavBar>
        <Container>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/browse" component={Search} />
            <Route path="/creations" component={Creations} />
            <Route path="/quiz/:quizId/edit" component={Quiz} />
            <Route path="/quiz/:quizId/study" component={Quiz} />
            <Route
              path="/flashcard-deck/:flashcardDeckId/edit"
              component={FlashcardDeck}
            />
            <Route
              path="/flashcard-deck/:flashcardDeckId/study"
              component={FlashcardDeck}
            />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Container>
      </Router>
    </Global>
  </Modals>
);

ReactDOM.render(routing, document.getElementById("root"));
