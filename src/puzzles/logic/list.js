import React from "react";

export default function List(props) {
	const history = props.history;
	const instanceList = props.instanceList;

	return (
		<div className="logic-puzzles page-container">
			<div className="instance-list-container">
				<h2>Logic Puzzles</h2>
				<ul>
					{instanceList
						? instanceList.map(
								renderInstanceListing.bind(null, history)
						  )
						: null}
				</ul>
			</div>
		</div>
	);
}

function renderInstanceListing(history, { instance, title }) {
	return (
		<li key={instance} onClick={() => history.push(`/logic/${instance}`)}>
			<h3>{capitalize(title)}</h3>
		</li>
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}
