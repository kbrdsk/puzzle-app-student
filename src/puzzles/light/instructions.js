import React, { useState } from "react";
import { JumpBack, JumpForward, StepBack, StepForward } from "./instance";

const example1 = { size: { cols: 1, rows: 1 }, beginstate: [], work: [] };
const example2 = { size: { cols: 3, rows: 1 }, beginstate: [], work: [] };
const example3 = { size: { cols: 3, rows: 3 }, beginstate: [], work: [] };
const example4 = {
	size: { cols: 3, rows: 3 },
	beginstate: [],
	work: [],
	neighborType: "x",
};

export default function Instructions({ history }) {
	return (
		<div className="light-instructions">
			<h2>
				Light Puzzle Instructions
				<hr />
			</h2>
			<div className="steps">
				<div className="step">
					<p>
						Here, the goal is to light up all the squares. Clicking
						a square toggles it on and off (clicking a dark square
						will light it up and clicking a lit square will make it
						dark again).
					</p>
					<Instance data={example1} />
				</div>
				<div className="step">
					<p>
						However, when you click on a square the same thing will
						happen to squares that are next to it.
					</p>
					<Instance data={example2} />
				</div>
				<div className="step">
					<p>
						You can use the navigation buttons at the bottom of the
						puzzle to go back and forward through the moves you've
						made.
					</p>
					<Instance data={example2} showNav={true} />
				</div>
				<div className="step">
					<p className="emphasized">
						It can be tempting to click randomly, but take it slow!
						Try to light up all the squares using as few moves as
						you can!
					</p>
				</div>
			</div>
			<button
				className="try-it"
				onClick={() => history.push("/light")}
			>
				Try It!
			</button>
		</div>
	);
}

export function InstructionsX({ history }) {
	return (
		<div className="light-instructions">
			<h2>
				Light Puzzle-X Instructions
				<hr />
			</h2>
			<div className="steps">
				<div className="step">
					<p>
						Puzzles marked with an "X" work a little differently.
						Clicking a square will light up squares the diagonal to
						it instead of ones directly next to it.
					</p>
				</div>
				<div className="examples">
					<div className="example">
						Normal Puzzle
						<Instance data={example3} />
					</div>
					<div className="example">
						Puzzle-X
						<Instance data={example4} />
					</div>
				</div>
			</div>
			<button
				className="try-it"
				onClick={() => history.push("/light/smallx")}
			>
				Try It!
			</button>
		</div>
	);
}

function Instance({ data, showNav }) {
	const [work, setWork] = useState(data.work);
	const [workPosition, setWorkPosition] = useState(0);
	const {
		size: { cols, rows },
		beginstate,
		neighborType,
	} = data;

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

	const jumpTo = (position) => {
		setWorkPosition(position);
	};

	const triggerSquare = (square) => {
		setWork([...work.slice(0, workPosition), square]);
		setWorkPosition(workPosition + 1);
	};

	const renderSquare = (row, ...[, col]) => {
		const neighbors = neighborList({ row, col });
		const activatedNeighbors = work
			.slice(0, workPosition)
			.filter((square) => neighbors.some(squareMatcher(square)));
		const isactive =
			(activatedNeighbors.length +
				(beginstate.some(squareMatcher({ row, col })) ? 1 : 0)) %
				2 >
			0;
		const classList = `light-square ${isactive ? "active" : "inactive"}`;
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
			{showNav ? (
				<div className="controller">
					<JumpBack
						jump={() => jumpTo(0)}
						isactive={workPosition > 0}
					/>
					<StepBack
						step={() => jumpTo(Math.max(workPosition - 1, 0))}
						isactive={workPosition > 0}
					/>
					<StepForward
						step={() =>
							jumpTo(Math.min(workPosition + 1, work.length))
						}
						isactive={workPosition < work.length}
					/>
					<JumpForward
						jump={() => jumpTo(work.length)}
						isactive={workPosition < work.length}
					/>
				</div>
			) : null}
		</div>
	);
}

function squareMatcher({ row, col }) {
	return (square) => square.col === col && square.row === row;
}
