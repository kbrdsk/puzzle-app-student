import React from "react";
import { Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import { potd, puzzleList } from "../puzzles/index";

export default function Home(props) {
	const state = props.location.state || { token: null };
	const token = state.token;
	const POTDPreview = potd.POTDPreview;
	const student = token
		? jwt.decode(token).student
		: { first: null, last: null };
	return token ? (
		<div>
			<h1>
				{student.first} {student.last}
			</h1>
			<div
				className="potd-container"
				onClick={() => props.history.push(`/${potd.id}`)}
			>
				<h2>Puzzle of the Day</h2>
				<POTDPreview />
			</div>
			<div className="puzzle-list-container">
				<h2>More Puzzles</h2>
			</div>
		</div>
	) : (
		<Redirect to="/login" />
	);
}
