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

function Routes() {
	const [user, setUser] = useState(null);
	const defaultContext = {
		user,
		setUser,
	};
	return (
		<BrowserRouter history={history}>
			<UserContext.Provider value={defaultContext}>
				{user ? (
					<div>
						<ProfileBar student={user.student} setUser={setUser} />
						<Switch>
							{puzzleList.map(renderPuzzleRoute)}
							<Route path="/login" component={Login} />
							<Route path="/" component={Home} />
						</Switch>
					</div>
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
}

function ProfileBar({ student, setUser }) {
	return (
		<div className="profile-bar">
			<span className="student-name">
				{capitalize(student.first)} {capitalize(student.last)}
			</span>
			<button onClick={() => setUser(null)} className="log-out">
				Log Out
			</button>
		</div>
	);
}

function renderPuzzleRoute(puzzle) {
	return (
		<Route key={puzzle.id} path={`/${puzzle.id}`} component={puzzle.Page} />
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}

//---------

ReactDOM.render(
	<React.StrictMode>
		<Routes />
	</React.StrictMode>,
	document.getElementById("root")
);
