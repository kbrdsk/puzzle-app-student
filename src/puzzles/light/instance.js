import React, { useState, useMemo, useContext, useEffect } from "react";
import { UserContext } from "../../login/user-context";

export default function Instance(props) {
	const name = useMemo(() => props.name, [props.name]);
	const sessionDataKey = useMemo(() => `light-instance-data-${name}`, [name]);
	const sessionData = useMemo(
		() => JSON.parse(sessionStorage.getItem(sessionDataKey)),
		[sessionDataKey]
	);
	const [data, setData] = useState(
		sessionData
			? sessionData
			: { size: {}, work: [], beginstate: [], neighborType: "+" }
	);
	const [work, setWork] = useState(data.work);
	const {
		size: { cols, rows },
		beginstate,
		neighborType,
	} = data;
	const [saveStatus, setSaveStatus] = useState(sessionData ? "saved" : null);
	const {
		user: { token },
	} = useContext(UserContext);
	const apiurl = `${process.env.REACT_APP_API_URL}/puzzles/light/${name}`;

	useEffect(() => {
		if (!sessionData) {
			(async () => {
				const response = await fetch(apiurl, {
					method: "GET",
					headers: { authorization: token },
				});
				if (response.ok) {
					try {
						const responseData = await response.json();
						sessionStorage.setItem(
							sessionDataKey,
							JSON.stringify(responseData)
						);
						setData(responseData);
						setSaveStatus("saved");
					} catch (error) {
						console.log(error);
					}
				} else console.log("HTTP error, status = " + response.status);
			})();
		}
	}, [apiurl, token, sessionData, sessionDataKey]);

	useEffect(() => {
		const url = `${process.env.REACT_APP_API_URL}/activepuzzle`;
		(async () => {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
				body: JSON.stringify({
					puzzleName: "light",
					puzzleId: name,
				}),
			});
		})();

		return () => {
			fetch(url, {
				method: "DELETE",
				headers: {
					authorization: token,
				},
			});
		};
	}, [token, name]);

	const updateWork = async (work) => {
		setSaveStatus("saving");
		const response = await fetch(apiurl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: token,
			},
			body: JSON.stringify({ puzzleData: work }),
		});

		const newSessionData = JSON.parse(
			sessionStorage.getItem(sessionDataKey)
		);
		newSessionData.work = work;
		sessionStorage.setItem(sessionDataKey, JSON.stringify(newSessionData));

		if (response.ok) setSaveStatus("saved");
		else setSaveStatus("error");
	};

	const neighborList = ({ row, col }) => {
		switch (neighborType) {
			case "x":
				return [
					{ row: row - 1, col: col - 1 },
					{ row: row + 1, col: col + 1 },
					{ row: row + 1, col: col - 1 },
					{ row: row - 1, col: col + 1 },
					{ row, col },
				];
			default:
				return [
					{ row: row - 1, col },
					{ row: row + 1, col },
					{ row, col: col - 1 },
					{ row, col: col + 1 },
					{ row, col },
				];
		}
	};

	const triggerSquare = (square) => {
		const updatedWork = [...work, square];
		setWork(updatedWork);
		updateWork(updatedWork);
	};

	const renderSquare = (row, ...[, col]) => {
		const neighbors = neighborList({ row, col });
		const activatedNeighbors = work.filter((square) =>
			neighbors.some(squareMatcher(square))
		);
		const isActive =
			(activatedNeighbors.length +
				(beginstate.some(squareMatcher({ row, col })) ? 1 : 0)) %
				2 >
			0;
		const classList = `light-square ${isActive ? "active" : "inactive"}`;
		return (
			<div
				className={classList}
				onClick={() => triggerSquare({ row, col })}
			/>
		);
	};

	const renderRow = (...[, index]) => {
		return (
			<div className="grid-row">
				{Array(cols).fill(null).map(renderSquare.bind(null, index))}
			</div>
		);
	};

	return (
		<div className="light-puzzle-container">
			<div className="light-grid" cols={cols} rows={rows}>
				{new Array(rows).fill(null).map(renderRow)}
			</div>
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
	);
}

function squareMatcher({ row, col }) {
	return (square) => square.col === col && square.row === row;
}
