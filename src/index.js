import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";

import Login from "./login/index";
import { UserContext } from "./login/user-context";
import Home from "./home/index";
import { puzzleList } from "./puzzles/index";

import "./stylesheets/index.css";

const history = createBrowserHistory();

function Routes() {
	const sessionUser = JSON.parse(sessionStorage.getItem("mcub-student-user"));
	const [user, setUser] = useState(sessionUser);
	const defaultContext = {
		user,
		setUser,
	};
	return (
		<HashRouter history={history} basename="/">
			<UserContext.Provider value={defaultContext}>
				{user ? (
					<div>
						<nav className="main-nav">
							<ProfileBar
								student={user.student}
								setUser={setUser}
							/>
							<Switch>
								<Route exact path="/" />
								<Route>
									<BackButton history={history} />
								</Route>
							</Switch>
						</nav>

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
		</HashRouter>
	);
}

function BackButton({ history }) {
	return (
		<button className="back-button" onClick={history.back}>
			Back
		</button>
	);
}

function ProfileBar({ student, setUser }) {
	return (
		<div className="profile-bar">
			<span className="student-name">
				{capitalize(student.first)} {capitalize(student.last)}
			</span>
			<button
				onClick={() => {
					setUser(null);
					sessionStorage.removeItem("mcub-student-user");
				}}
				className="log-out"
			>
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
