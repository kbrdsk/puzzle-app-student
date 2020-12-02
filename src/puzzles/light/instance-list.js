import React, { useState, useEffect } from "react";
import Instance from "./instance";
import { Route, Switch } from "react-router-dom";

const instances = {
	beginner: Array.from({ length: 5 }, (...[, i]) => i + 1),
	intermediate: Array.from({ length: 5 }, (...[, i]) => i + 1),
	expert: Array.from({ length: 3 }, (...[, i]) => i + 1),
};

export default function List({ history, name, match }) {
	const instanceList = instances[name];
	const [current, setCurrent] = useState(1);

	useEffect(() => {
		history.push(`/light/${name}/${current}`);
	}, [current, name, history]);

	const renderInstanceRoute = (match, instance) => {
		return (
			<Route
				key={instance}
				path={`${match.url}/${instance}`}
				render={(props) => (
					<Instance {...props} name={`${name}${instance}`} />
				)}
			/>
		);
	};

	const renderInstanceSelector = (instance) => (
		<button
			key={`selector-${instance}`}
			onClick={() => setCurrent(instance)}
			className={`instance selector ${
				instance === current ? "selected" : ""
			}`}
		></button>
	);

	const next = () => setCurrent(Math.min(current + 1, instanceList.length));

	const previous = () => setCurrent(Math.max(current - 1, 1));

	return (
		<div className={`light category-container ${name}`}>
			{/*<h2>{`Light Puzzles - ${capitalize(name)} `}</h2>;*/}
			<Switch>
				{instanceList.map(renderInstanceRoute.bind(null, match))}
				<Route render={() => history.push("/light")} />
			</Switch>
			<div className="selector-container">
				<button
					className={`previous selector  ${
						current === 1 ? "inactive" : "active"
					}`}
					onClick={previous}
				>
					Prev
				</button>
				{instanceList.map(renderInstanceSelector)}
				<button
					className={`next selector  ${
						current === instanceList.length ? "inactive" : "active"
					}`}
					onClick={next}
				>
					Next
				</button>
			</div>
		</div>
	);
}

function capitalize(string) {
	return string.replace(/^./, (char) => char.toUpperCase());
}
