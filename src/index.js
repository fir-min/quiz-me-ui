import React from "react";
import ReactDOM from "react-dom";
import "./app.css";
import Main from "./components/main";
import NotFound from "./components/notFound";
import "semantic-ui-less/semantic.less";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import Global from "./components/global";
import Modals from "./components/modals";
import Search from "./components/search";
import Creations from "./components/creations";
import MenuBar from "./components/menu";

const routing = (
  <Modals>
    <Global>
      <Router>
        <MenuBar>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/search" component={Search} />
            <Route path="/creations" component={Creations} />
            <Route path="/about" component={NotFound} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </MenuBar>
      </Router>
    </Global>
  </Modals>
);

ReactDOM.render(routing, document.getElementById("root"));
