import React from "react";

export default function List(props) {
	const history = props.history;
	const instanceList = props.instanceList;

	return (
		<div className="calcudoku-page-container">
			<div className="instance-list-container">
				<h2>Calcudokus</h2>
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

function renderInstanceListing(history, instance) {
	return (
		<li
			key={instance}
			onClick={() => history.push(`/calcudoku/${instance}`)}
		>
			<h3>{capitalize(instance)}</h3>
		</li>
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}
