import React, {
	useState,
	useMemo,
	useContext,
	useEffect,
	useCallback,
} from "react";
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
			: {
					size: {},
					work: [],
					beginstate: [],
					neighborType: "+",
					workPosition: 0,
			  }
	);
	const [work, setWork] = useState(data.work);
	const [workPosition, setWorkPosition] = useState(
		data.workPosition || work.length
	);
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
						setWork(responseData.work);
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
			await fetch(url, {
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

	const isActive = useCallback(
		(square) => {
			const neighbors = neighborList(square);
			const activatedNeighbors = work
				.slice(0, workPosition)
				.filter((sq) => neighbors.some(squareMatcher(sq)));
			return (
				(activatedNeighbors.length +
					(beginstate.some(squareMatcher(square)) ? 1 : 0)) %
					2 >
				0
			);
		},
		[work, workPosition, beginstate]
	);

	const checkComplete = useCallback(() => {
		for (let row; row < rows; row++) {
			for (let col; col < cols; col++) {
				if (!isActive({ row, col })) return false;
			}
		}
		return true;
	}, [cols, rows, isActive]);

	useEffect(() => {
		const sessionData = JSON.parse(sessionStorage.getItem(sessionDataKey));
		if (sessionData.completed) return;
		else if (checkComplete()) {
			fetch(`${apiurl}/completed`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
				body: JSON.stringify({ completed: true }),
			});
			sessionData.completed = true;
			sessionStorage.setItem(sessionDataKey, JSON.stringify(sessionData));
		}
	}, [sessionDataKey, checkComplete, apiurl, token]);

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
		newSessionData.workPosition = work.length;
		sessionStorage.setItem(sessionDataKey, JSON.stringify(newSessionData));

		if (response.ok) setSaveStatus("saved");
		else setSaveStatus("error");
	};

	const triggerSquare = (square) => {
		const updatedWork = [...work.slice(0, workPosition), square];
		setWorkPosition(workPosition + 1);
		setWork(updatedWork);
		updateWork(updatedWork);
	};

	const renderSquare = (row, ...[, col]) => {
		const classList = `light-square ${
			isActive({ row, col }) ? "active" : "inactive"
		}`;
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

	const jumpTo = (position) => {
		setWorkPosition(position);
		const newSessionData = JSON.parse(
			sessionStorage.getItem(sessionDataKey)
		);
		newSessionData.workPosition = position;
		sessionStorage.setItem(sessionDataKey, JSON.stringify(newSessionData));
	};

	return (
		<div className="light-puzzle-container">
			<div className="moves-indicator">
				Moves: <span className="moves">{workPosition}</span>
			</div>
			<div className="light-grid" cols={cols} rows={rows}>
				{new Array(rows).fill(null).map(renderRow)}
			</div>
			<div className="controller">
				<JumpBack jump={() => jumpTo(0)} isactive={workPosition > 0} />
				<StepBack
					step={() => jumpTo(Math.max(workPosition - 1, 0))}
					isactive={workPosition > 0}
				/>
				<StepForward
					step={() => jumpTo(Math.min(workPosition + 1, work.length))}
					isactive={workPosition < work.length}
				/>
				<JumpForward
					jump={() => jumpTo(work.length)}
					isactive={workPosition < work.length}
				/>
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

function StepBack({ step, isactive }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="2048"
			height="2048"
			viewBox="0 0 2048 2048"
			onClick={step}
			className="step back nav-button"
			isactive={isactive.toString()}
		>
			<path
				d="M1344 576v896q0 26-19 45t-45
				19-45-19l-448-448q-19-19-19-45t19-45l448-448q19-19 45-19t45 19
				19 45z"
			/>
		</svg>
	);
}

function JumpBack({ jump, isactive }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="2048"
			height="2048"
			viewBox="0 0 2048 2048"
			onClick={jump}
			className="jump back nav-button"
			isactive={isactive.toString()}
		>
			<path
				d="M1811 269q19-19 32-13t13 32v1472q0 
			26-13 32t-32-13l-710-710q-8-9-13-19v710q0 
			26-13 32t-32-13l-710-710q-19-19-19-45t19-45l710-710q19-19 
			32-13t13 32v710q5-11 13-19z"
			/>
		</svg>
	);
}

function StepForward({ step, isactive }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="2048"
			height="2048"
			viewBox="0 0 2048 2048"
			onClick={step}
			className="step forward nav-button"
			isactive={isactive.toString()}
		>
			<path
				d="M1280 1024q0 26-19 45l-448 448q-19 19-45 
				19t-45-19-19-45v-896q0-26 19-45t45-19 45 
				19l448 448q19 19 19 45z"
			/>
		</svg>
	);
}

function JumpForward({ jump, isactive }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="2048"
			height="2048"
			viewBox="0 0 2048 2048"
			onClick={jump}
			className="jump forward nav-button"
			isactive={isactive.toString()}
		>
			<path
				d="M237 1779q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 
				710q8 8 13 19v-710q0-26 13-32t32 13l710 710q19 19 19 45t-19 
				45l-710 710q-19 19-32 13t-13-32v-710q-5 10-13 19z"
			/>
		</svg>
	);
}
