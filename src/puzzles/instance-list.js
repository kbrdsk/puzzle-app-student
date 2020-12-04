import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../login/user-context";

export default function List({ history, instanceList, title, puzzleType }) {
	const { user } = useContext(UserContext);
	const [completionStatusFetched, setCompletionStatusFetched] = useState(
		false
	);

	useEffect(() => {
		if (!completionStatusFetched) {
			(async () => {
				await instanceList.fetchCompletionStatus(user);
				setCompletionStatusFetched(true);
			})();
		}
	}, [completionStatusFetched, instanceList, user]);

	const renderInstanceListing = (history, { instance, title }) => {
		const sessionDataKey = `${puzzleType}-instance-data-${instance}`;
		const sessionData = JSON.parse(sessionStorage.getItem(sessionDataKey));
		const completed = sessionData ? sessionData.completed : false;

		return (
			<li
				key={instance}
				onClick={() => history.push(`/${puzzleType}/${instance}`)}
				className={completed ? "completed" : ""}
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
