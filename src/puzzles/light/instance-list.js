import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Instance from "./instance";
import { InstructionsX } from "./instructions";

const instanceList = Array.from({ length: 5 }, (...[, i]) => i + 1);

export default function List({ history, name, match }) {
	const [current, setCurrent] = useState(1);

	useEffect(() => {
		if (!name.match("instructions")) {
			history.push(`/light/${name}/${current}`);
		}
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

	const next = () => setCurrent(Math.min(current + 1, 5));

	const previous = () => setCurrent(Math.max(current - 1, 1));

	return name === "instructionsx" ? (
		<InstructionsX history={history} />
	) : (
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
