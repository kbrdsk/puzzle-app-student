import React, { useState, useMemo } from "react";
import { useUpdateActivePuzzle, useUpdateWork } from "../../api-utils.js";
import Controller from "./controller";

export default function Instance(props) {
	const name = useMemo(() => props.name, [props.name]);
	const sessionDataKey = useMemo(() => `tangram-instance-data-${name}`, [
		name,
	]);
	const data = useMemo(
		() => JSON.parse(sessionStorage.getItem(sessionDataKey)),
		[sessionDataKey]
	);
	const [work, setWork] = useState(data.work);
	const [saveStatus, setSaveStatus] = useState("saved");

	useUpdateActivePuzzle("tangram", name);

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
