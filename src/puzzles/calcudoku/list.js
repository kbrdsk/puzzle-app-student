import React from "react";
import { Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";

export default function List(props) {
	const state = props.location.state || { token: null };
	const token = state.token;
	const history = props.history;
	const instanceList = props.instanceList;
	const student = token
		? jwt.decode(token).student
		: { first: null, last: null };

	return token ? (
		<div className="calcudoku-page-container">
			<p className="student-name">
				{capitalize(student.first)} {capitalize(student.last)}
			</p>
			<div className="instance-list-container">
				<h2>Calcudokus</h2>
				<ul>
					{instanceList
						? instanceList.map(
								renderInstanceListing.bind(null, history, token)
						  )
						: null}
				</ul>
			</div>
		</div>
	) : (
		<Redirect to="/login" />
	);
}

function renderInstanceListing(history, token, instance) {
	return (
		<li
			key={instance}
			onClick={() => history.push(`/calcudoku/${instance}`, { token })}
		>
			<h3>{capitalize(instance)}</h3>
		</li>
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}
