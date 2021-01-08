import React, { useState, useMemo } from "react";
import { useUpdateActivePuzzle, useUpdateWork } from "../../api-utils.js";
import Canvas from "./canvas";

export default function Instance(props) {
	const name = useMemo(() => props.name, [props.name]);
	const sessionDataKey = useMemo(() => `matchstick-instance-data-${name}`, [
		name,
	]);
	const data = useMemo(
		() => JSON.parse(sessionStorage.getItem(sessionDataKey)),
		[sessionDataKey]
	);
	const [work, setWork] = useState(data.work);
	const [saveStatus, setSaveStatus] = useState("saved");

	useUpdateActivePuzzle("matchstick", name);

	const updateWork = useUpdateWork("matchstick", name, setSaveStatus);
	const workUpdater = (newWork = work) => updateWork(newWork);

	const reset = () => {
		const resetWork = data.startingConfiguration.map((stick) =>
			stick.map((endpoint) => {
				return { ...endpoint };
			})
		);
		setWork(resetWork);
		workUpdater(resetWork);
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
					updateWork={workUpdater}
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
				d="M1767 1184q0 5-1 7-64 268-268 434.5t-478 166.5q-146 
			0-282.5-55t-243.5-157l-129 129q-19 19-45 19t-45-19-19-45v-448q0-26 
			19-45t45-19h448q26 0 45 19t19 45-19 45l-137 137q71 66 161 102t187 
			36q134 0 250-65t186-179q11-17 53-117 8-23 30-23h192q13 0 22.5 
			9.5t9.5 22.5zm25-800v448q0 26-19 45t-45 19h-448q-26 0-45-19t-19-45 
			19-45l138-138q-148-137-349-137-134 0-250 65t-186 179q-11 17-53 
			117-8 23-30 23h-199q-13 0-22.5-9.5t-9.5-22.5v-7q65-268 
			270-434.5t480-166.5q146 0 284 55.5t245 156.5l130-129q19-19 45-19t45 
			19 19 45z"
			/>
		</svg>
	);
}
