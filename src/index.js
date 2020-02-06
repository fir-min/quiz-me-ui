import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Main from "./components/main";
import NotFound from "./components/notFound";
import "bootstrap/dist/css/bootstrap.css";
import "./app.scss";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import NavBar from "./components/navbar";
import Global from "./components/global";
import Modals from "./components/modals";
import Search from "./components/search";
import Creations from "./components/creations";
import Container from "./components/container";

const routing = (
  <Modals>
    <Global>
      <Router>
        <NavBar></NavBar>
        <Container>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/search" component={Search} />
            <Route path="/creations" component={Creations} />
            <Route path="/about" component={NotFound} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Container>
      </Router>
    </Global>
  </Modals>
);

ReactDOM.render(routing, document.getElementById("root"));
