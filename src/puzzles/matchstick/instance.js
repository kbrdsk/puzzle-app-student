import React, { useState, useMemo, useContext, useEffect } from "react";
import { UserContext } from "../../login/user-context";
import Canvas from "./canvas";

export default function Instance(props) {
	const name = useMemo(() => props.name, [props.name]);
	const sessionDataKey = useMemo(() => `matchstick-instance-data-${name}`, [
		name,
	]);
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
					startingConfiguration: [],
					stickLength: 0,
					selectionProximity: 0,
					height: 0,
					width: 0,
			  }
	);
	const [work, setWork] = useState(data.work);
	const [saveStatus, setSaveStatus] = useState(sessionData ? "saved" : null);
	const {
		user: { token },
	} = useContext(UserContext);
	const apiurl = `${process.env.REACT_APP_API_URL}/puzzles/matchstick/${name}`;

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
					puzzleName: "matchstick",
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

	const updateWork = async (newWork = work) => {
		setSaveStatus("saving");
		const response = await fetch(apiurl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: token,
			},
			body: JSON.stringify({ puzzleData: newWork }),
		});

		const newSessionData = JSON.parse(
			sessionStorage.getItem(sessionDataKey)
		);
		newSessionData.work = newWork;
		sessionStorage.setItem(sessionDataKey, JSON.stringify(newSessionData));

		if (response.ok) setSaveStatus("saved");
		else setSaveStatus("error");
	};

	const reset = () => {
		const resetWork = data.startingConfiguration.map((stick) =>
			stick.map((endpoint) => {
				return { ...endpoint };
			})
		);
		setWork(resetWork);
		updateWork(resetWork);
	};

	return (
		<div className="matchstick puzzle-container">
			<p className="description">{data.description}</p>
			<div className="matchstick display-container">
				<Reset reset={reset} isactive={true} />
				<Canvas
					puzzleData={data}
					sticks={work}
					setSticks={setWork}
					updateWork={updateWork}
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
		</div>
	);
}

function Reset({ reset, isactive }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="2048"
			height="2048"
			viewBox="0 0 2048 2048"
			onClick={reset}
			className="reset nav-button"
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
