import React from "react";

export default function List({ history, instanceList, title, puzzleType }) {
	const renderInstanceListing = (history, { instance, title }) => {
		return (
			<li
				key={instance}
				onClick={() => history.push(`/${puzzleType}/${instance}`)}
			>
				<h3>{capitalize(title)}</h3>
			</li>
		);
	};
	return (
		<div className="instance-list-container">
			<h2>{title}</h2>
			<ul>
				{instanceList.map(renderInstanceListing.bind(null, history))}
			</ul>
		</div>
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}
