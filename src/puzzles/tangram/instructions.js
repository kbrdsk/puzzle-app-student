import React from "react";
import Controller from "./controller";
import { defaultData } from "./sample-data";

export default function Instructions({ history }) {
	return (
		<div className="tangram tangram-instructions">
			<h2>
				Tangram Instructions
				<hr />
			</h2>
			<p className="instructions">
				In tangram puzzles you will be given the same pieces each time
				and be tasked with making different shapes out of them! To move
				a piece, simply drag it. And to rotate a piece drag one of its
				corners.
			</p>
			<Controller data={defaultData} work={{}} updateWork={() => {}} />
			<button className="try-it" onClick={() => history.push("/tangram")}>
				Try It!
			</button>
		</div>
	);
}
