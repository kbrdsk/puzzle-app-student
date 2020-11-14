import React from "react";

export default function List(props) {
	const history = props.history;
	const instanceList = props.instanceList.sort(sortInstances);

	return (
		<div className="calcudoku-page-container">
			<div className="instance-list-container">
				<h2>Calcudokus</h2>
				<ul>
					<li
						key="instructions"
						onClick={() => history.push(`/calcudoku/instructions`)}
					>
						<h3>Instructions</h3>
					</li>
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
		<li
			key={instance}
			onClick={() => history.push(`/calcudoku/${instance}`)}
		>
			<h3>{capitalize(title)}</h3>
		</li>
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}

function sortInstances({ instance: a }, { instance: b }) {
	const [, sizeA, levelA, numberA] = a.match(/^(\d)x\d([a-z]+)(\d+)$/);
	const [, sizeB, levelB, numberB] = b.match(/^(\d)x\d([a-z]+)(\d+)$/);
	if (sizeA < sizeB) return -1;
	if (sizeB > sizeA) return 1;
	if (levelA === "beginner" && ["intermediate", "expert"].includes(levelB))
		return -1;
	if (levelA === "intermediate" && levelB === "expert") return -1;
	if (levelA === levelB && numberA < numberB) return -1;
	return 1;
}
