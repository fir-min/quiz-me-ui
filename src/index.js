import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./components/main";
import NotFound from "./components/notFound";
import "bootstrap/dist/css/bootstrap.css";
import "./app.css";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import NavBar from "./components/navbar";
import User from "./components/user";
import Modals from "./components/modals";
import Search from "./components/search";
import Creations from "./components/creations";

const routing = (
  <Modals>
    <User>
      <Router>
        <NavBar></NavBar>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/search" component={Search} />
          <Route path="/creations" component={Creations} />
          <Route path="/about" component={NotFound} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    </User>
  </Modals>
);

ReactDOM.render(routing, document.getElementById("root"));
