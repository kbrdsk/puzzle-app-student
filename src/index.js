import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import Login from "./login/index";
import Home from "./home/index";
import { puzzleList } from "./puzzles/index";

import "./stylesheets/index.css";

const history = createBrowserHistory();

const renderPuzzleRoute = (puzzle) => (
	<Route key={puzzle.id} path={`/${puzzle.id}`} component={puzzle.Page} />
);

const Routes = () => {
	return (
		<BrowserRouter history={history}>
			<Switch>
				{puzzleList.map(renderPuzzleRoute)}
				<Route path="/login" component={Login} />
				<Route path="/" component={Home} />
			</Switch>
		</BrowserRouter>
	);
};

//---------

ReactDOM.render(
	<React.StrictMode>
		<Routes />
	</React.StrictMode>,
	document.getElementById("root")
);
