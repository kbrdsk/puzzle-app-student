import React from "react";
import { Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import { potd, puzzleList } from "../puzzles/index";

export default function Home(props) {
	const state = props.location.state || { token: null };
	const token = state.token;
	const history = props.history;
	const student = token
		? jwt.decode(token).student
		: { first: null, last: null };
	return token ? (
		<div className="dashboard-container">
			<p className="student-name">
				{capitalize(student.first)} {capitalize(student.last)}
			</p>
			<POTD history={history} token={token} />
			<div className="puzzle-list-container">
				<h2>Individual Work</h2>
				<ul>
					{puzzleList.map(
						renderPuzzleListing.bind(null, history, token)
					)}
				</ul>
			</div>
		</div>
	) : (
		<Redirect to="/login" />
	);
}

function POTD(props) {
	const POTDPreview = potd.Preview;
	return (
		<div
			className="potd-container"
			onClick={() =>
				props.history.push(potd.uri, { token: props.token })
			}
		>
			<h2>Puzzle of the Day</h2>
			<POTDPreview />
		</div>
	);
}

function renderPuzzleListing(history, token, puzzle) {
	return (
		<li
			key={puzzle.id}
			onClick={() => history.push(`/${puzzle.id}`, { token })}
		>
			<h3>{puzzle.name}</h3>
			{puzzle.ListPreview()}
		</li>
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}
