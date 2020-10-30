import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";

import Login from "./login/index";
import { UserContext } from "./login/user-context";
import Home from "./home/index";
import { puzzleList } from "./puzzles/index";

import "./stylesheets/index.css";

const history = createBrowserHistory();

const renderPuzzleRoute = (puzzle) => (
	<Route key={puzzle.id} path={`/${puzzle.id}`} component={puzzle.Page} />
);

const Routes = () => {
	const [user, setUser] = useState(null);
	const defaultContext = {
		user,
		setUser,
	};
	return (
		<BrowserRouter history={history}>
			<UserContext.Provider value={defaultContext}>
				{user ? (
					<Switch>
						{puzzleList.map(renderPuzzleRoute)}
						<Route path="/login" component={Login} />
						<Route path="/" component={Home} />
					</Switch>
				) : (
					<Switch>
						<Route path="/login" component={Login} />
						<Route path="/">
							<Redirect to="/login" />
						</Route>
					</Switch>
				)}
			</UserContext.Provider>
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
