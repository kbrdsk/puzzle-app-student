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
		<div className="calcudoku-page-container">
			<div className="instance-list-container">
				{instanceList.length === 0 ? (
					<h2 className="fetching-indicator">Loading...</h2>
				) : (
					<div>
						<h2>{title}</h2>
						<ul>
							{instanceList.map(
								renderInstanceListing.bind(null, history)
							)}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}
