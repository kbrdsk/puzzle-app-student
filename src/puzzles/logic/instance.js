import React, { useState, useEffect, useCallback, useRef } from "react";
import { useUpdateActivePuzzle, useUpdateWork } from "../../api-utils.js";

export default function Instance(props) {
	const { name } = props;
	const sessionDataKey = `logic-instance-data-${name}`;
	const sessionData = JSON.parse(sessionStorage.getItem(sessionDataKey));
	const { description } = sessionData;
	const [work, setWork] = useState(sessionData.work);
	const [saveStatus, setSaveStatus] = useState("saved");
	const [updateTimer, setUpdateTimer] = useState(30);
	const initializing = useRef(true);
	const updateWork = useUpdateWork("logic", name, setSaveStatus);
	const workUpdater = useCallback(() => updateWork(work), [work]);

	useUpdateActivePuzzle("logic", name);

	useEffect(() => {
		if (initializing.current) return (initializing.current = false);
		setSaveStatus(null);
		const clearHistoryListener = props.history.listen(workUpdater);
		const updateTimer = setTimeout(workUpdater, 3000);
		return () => {
			clearTimeout(updateTimer);
			clearHistoryListener();
		};
	}, [workUpdater, props.history, setSaveStatus, initializing]);

	useEffect(() => {
		const conditionalUpdater = () => {
			if (saveStatus !== "saved") workUpdater();
		};
		window.addEventListener("beforeunload", conditionalUpdater);
		return () => {
			window.removeEventListener("beforeunload", conditionalUpdater);
		};
	}, [workUpdater, saveStatus]);

	useEffect(() => {
		if (updateTimer === 0) {
			setUpdateTimer(30);
			if (!saveStatus) workUpdater();
		}
	}, [updateTimer, workUpdater, saveStatus]);

	useEffect(() => {
		const timeInterval = setInterval(
			() => setUpdateTimer((timer) => timer - 1),
			1000
		);
		return () => clearInterval(timeInterval);
	}, [setUpdateTimer]);

	return description ? (
		<div className="logic instance">
			<p className="puzzle-description">{description}</p>
			<textarea
				className="work"
				onChange={(e) => {
					setWork(e.target.value);
					//workUpdater();
				}}
				value={work}
				placeholder="Enter your solution or any notes here!"
			/>
			<div className="saving-indicator">
				{saveStatus === "saving"
					? "Saving..."
					: saveStatus === "error"
					? "An error occurred while saving."
					: saveStatus === "saved"
					? "Saved."
					: " "}
			</div>
		</div>
	) : (
		<h2 className="loading-indicator">Loading...</h2>
	);
}
