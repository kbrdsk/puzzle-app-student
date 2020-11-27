import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";

import Login from "./login/index";
import { UserContext } from "./login/user-context";
import Home from "./home/index";
import { puzzleList } from "./puzzles/index";
import InstanceRouter from "./puzzles/instance-router";

import "./stylesheets/index.css";

const history = createBrowserHistory();

const backArrowPath = (
	<path
		d={
			"M1792 1024v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 " +
			"38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-" +
			"37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 " +
			"38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"
		}
	/>
);

function Routes() {
	const sessionUser = JSON.parse(sessionStorage.getItem("mcub-student-user"));
	const [user, setUser] = useState(sessionUser);
	const defaultContext = {
		user,
		setUser,
	};

	useEffect(() => {
		if (user) {
			(async () => {
				try {
					await fetchUserData(user);
				} catch (error) {
					console.log(error);
				}
			})();
		}
	}, [user]);

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
								<Route component={BackButton} />
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
	const prevURL = window.location.href.match(/#(.*)\/[^/]+$/)[1];
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="2048"
			height="2048"
			viewBox="0 0 2048 2048"
			onClick={() => history.push(prevURL)}
			className="back-button"
		>
			{backArrowPath}
		</svg>
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
	const { Instance, id, Instructions, name, instanceList } = puzzle;
	return (
		<Route
			key={puzzle.id}
			path={`/${puzzle.id}`}
			render={(props) => (
				<InstanceRouter
					{...props}
					Instance={Instance}
					id={id}
					Instructions={Instructions}
					name={name}
					instanceList={instanceList}
				/>
			)}
		/>
	);
}

async function fetchUserData({ token }) {
	const url = `${process.env.REACT_APP_API_URL}/data`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			authorization: token,
		},
	});
	if (response.ok) {
		const data = await response.json();
		for (let puzzleName in data) {
			for (let puzzle of data[puzzleName]) {
				const { puzzleId } = puzzle;
				const instanceKey = `${puzzleName}-instance-data-${puzzleId}`;
				sessionStorage.setItem(instanceKey, JSON.stringify(puzzle));
			}
		}
	} else {
		console.log(`HTTP error, status = ${response.status}`);
	}
}

function capitalize(string) {
	return string.replace(/^.|\W./g, (char) => char.toUpperCase());
}

//---------

ReactDOM.render(
	<React.StrictMode>
		<Routes />
	</React.StrictMode>,
	document.getElementById("root")
);
