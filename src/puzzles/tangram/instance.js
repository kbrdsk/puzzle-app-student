import React, { useState } from "react";
import { puzzleData } from "./test-data";
import Controller from "./controller";

export default function Instance(props) {
	const [data, setData] = useState(puzzleData);
	const [work, setWork] = useState(data.work);

	const updateWork = () => {};

	return (
		<div className="tangram puzzle-container">
			<p className="description">{data.description}</p>
			<Controller data={data} work={work} updateWork={updateWork} />
		</div>
	);
}
