import React, {
	useState,
	useEffect,
	useContext,
	useCallback,
	useMemo,
	useRef,
} from "react";
import { UserContext } from "../../login/user-context";
import { useUpdateActivePuzzle, useUpdateWork } from "../../api-utils.js";

export default function Instance(props) {
	const name = useMemo(() => props.name, [props.name]);
	const sessionDataKey = useMemo(() => `logic-instance-data-${name}`, [name]);
	const [description, setDescription] = useState("");
	const [work, setWork] = useState("");
	const [saveStatus, setSaveStatus] = useState(null);
	const [updateTimer, setUpdateTimer] = useState(30);
	const initializing = useRef(true);
	const {
		user: { token },
	} = useContext(UserContext);
	const apiurl = `${process.env.REACT_APP_API_URL}/puzzles/logic/${name}`;

	useMemo(() => {
		const sessionData = JSON.parse(sessionStorage.getItem(sessionDataKey));

		if (sessionData) {
			setDescription(sessionData.description);
			setWork(sessionData.work);
			setSaveStatus("saved");
			return;
		}

		(async () => {
			const response = await fetch(apiurl, {
				method: "GET",
				headers: { authorization: token },
			});
			if (response.ok) {
				try {
					const { description, work } = await response.json();
					sessionStorage.setItem(
						sessionDataKey,
						JSON.stringify({ description, work })
					);
					setDescription(description);
					setWork(work);
					setSaveStatus("saved");
				} catch (error) {
					console.log(error);
				}
			} else console.log("HTTP error, status = " + response.status);
		})();
	}, [apiurl, token, setWork, sessionDataKey]);

	useUpdateActivePuzzle("logic", name);

	const updateWork = useUpdateWork("logic", name, setSaveStatus);
	const workUpdater = useCallback(() => updateWork(work), [work]);

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
