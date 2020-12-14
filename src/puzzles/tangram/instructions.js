import React, { useState, useEffect } from "react";
import Canvas from "./canvas";

const demoData = {
	height: 1024,
	width: 1024,
	selectionProximity: 25,
	stickLength: 400,
	stickWidth: 12,
	startingConfiguration: [
		[
			{ x: 100, y: 312 },
			{ x: 100, y: 712 },
		],
		[
			{ x: 130, y: 312 },
			{ x: 130, y: 712 },
		],
		[
			{ x: 160, y: 312 },
			{ x: 160, y: 712 },
		],
	],
};

export default function Instructions({ history }) {
	return (
		<div className="tangram-instructions">
			<h2>
				Matchstick Puzzle Instructions
				<hr />
			</h2>
			<div className="instructions">
				<p>
					Before you try the puzzles, see if you can make a triangle
					using the sticks below.
				</p>
				<p>
					You can move sticks by dragging them from their middle and
					rotate sticks by dragging them from either end.
				</p>
				<p>
					The button in the upper left resets the sticks to their
					original position.
				</p>
				<Instance data={demoData} />
				<p>These puzzle can be really tricky, good luck!</p>
			</div>
			<button
				className="try-it"
				onClick={() => history.push("/tangram")}
			>
				Try It!
			</button>
		</div>
	);
}