import React, { useState } from "react";
import { useUpdateActivePuzzle, useUpdateWork } from "../../api-utils.js";
import Controller from "./controller";

export default function Instance({name}) {
	const sessionDataKey = `tangram-instance-data-${name}`;
	const data = JSON.parse(sessionStorage.getItem(sessionDataKey));
	const [work, setWork] = useState(data.work);
	const [saveStatus, setSaveStatus] = useState("saved");
	const updateWork = useUpdateWork("tangram", name, setSaveStatus);

	const workUpdater = (shapes) => {
		const newWork = { ...work };
		for (let shape of shapes) {
			const { name, center, angle } = shape;
			newWork[name] = { center, angle };
		}
		setWork(newWork);
		updateWork(newWork);
	};

	useUpdateActivePuzzle("tangram", name);

	return (
		<div className="tangram puzzle-container">
			<p className="description">{data.description}</p>
			<Controller
				data={data}
				work={work}
				updateWork={workUpdater}
				saveStatus={saveStatus}
			/>
		</div>
	);
}
