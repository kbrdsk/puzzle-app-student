import React, { useState } from "react";

const parsedOperations = {
	"-": "-",
	"+": "+",
	"*": "x",
	"/": "÷",
};

const example1 = {
	size: 4,
	work: Array(16)
		.fill(null)
		.map((...[, i]) => {
			const row = Math.floor(i / 4);
			const col = i % 4;
			const value = ((col + row) % 4) + 1;
			return { row, col, value };
		}),
	cages: [],
};
const example2 = {
	size: 4,
	work: [
		{ col: 0, row: 0, value: 1 },
		{ col: 1, row: 0, value: 2 },
		{ col: 2, row: 0, value: 3 },
		{ col: 3, row: 0, value: 4 },
		{ col: 0, row: 2, value: 2 },
		{ col: 0, row: 3, value: 4 },
		{ col: 1, row: 3, value: 1 },
		{ col: 3, row: 3, value: 3 },
		{ col: 2, row: 1, value: 2 },
		{ col: 2, row: 2, value: 4 },
	],
	cages: [
		{
			squares: [
				{ col: 0, row: 0 },
				{ col: 1, row: 0 },
			],
			operation: "+",
			result: "3",
		},
		{
			squares: [
				{ col: 2, row: 0 },
				{ col: 3, row: 0 },
			],
			operation: "-",
			result: "1",
		},
		{ squares: [{ col: 3, row: 3 }], operation: "", result: "3" },
		{
			squares: [
				{ col: 0, row: 2 },
				{ col: 0, row: 3 },
				{ col: 1, row: 3 },
			],
			operation: "*",
			result: "8",
		},
		{
			squares: [
				{ col: 2, row: 1 },
				{ col: 2, row: 2 },
			],
			operation: "/",
			result: "2",
		},
	],
};
const example3 = {
	size: 4,
	work: Array(16)
		.fill(null)
		.map((...[, i]) => {
			const values = [3, 2, 4, 1, 2, 1, 3, 4, 4, 3, 1, 2, 1, 4, 2, 3];
			const row = Math.floor(i / 4);
			const col = i % 4;
			const value = values[i];
			return { row, col, value };
		}),
	cages: [
		{
			squares: [
				{ col: 0, row: 0 },
				{ col: 0, row: 1 },
			],
			operation: "+",
			result: "5",
		},
		{
			squares: [
				{ col: 0, row: 2 },
				{ col: 0, row: 3 },
				{ col: 1, row: 3 },
			],
			operation: "+",
			result: "9",
		},
		{
			squares: [
				{ col: 1, row: 0 },
				{ col: 1, row: 1 },
				{ col: 2, row: 0 },
			],
			operation: "-",
			result: "1",
		},
		{
			squares: [
				{ col: 1, row: 2 },
				{ col: 2, row: 2 },
			],
			operation: "+",
			result: "4",
		},
		{
			squares: [
				{ col: 2, row: 1 },
				{ col: 3, row: 0 },
				{ col: 3, row: 1 },
			],
			operation: "-",
			result: "0",
		},
		{
			squares: [
				{ col: 2, row: 3 },
				{ col: 3, row: 2 },
				{ col: 3, row: 3 },
			],
			operation: "+",
			result: "7",
		},
	],
};

export default function Instructions({ history }) {
	return (
		<div className="calcudoku-instructions">
			<h2>
				Calcudoku Instructions
				<hr />
			</h2>

			<p>
				The goal of each puzzle is to fill the grid using only certain
				digits –– 1 through 4 for a 4×4 grid, 1 through 5 for a 5×5,
				etc. –– so that no digit appears more than once in any row or
				any column.
			</p>
			<Instance data={example1} />
			<p>
				Additionally, the grid is divided into heavily outlined groups
				of squares called “cages”. Each cage has a target number and an
				operation in its upper left corner. The numbers when the numbers
				in the cage are combined using the cage’s operation they must
				equal the target number.
			</p>
			<Instance data={example2} />
			<p>
				Digits may be repeated within a cage, as long as they are not in
				the same row or column. No operation is relevant for a
				single-cell cage: placing the "target" in the cell is the only
				possibility.
			</p>
			<Instance data={example3} />
			<p>
				Be careful that you know for sure that a number{" "}
				<strong>has</strong> to go in a square before you put it there.
				Making a mistake early can cause trouble later on. Use lots of
				process of elimination!
			</p>
			<button
				className="try-it"
				onClick={() => history.push("/calcudoku")}
			>
				Try It!
			</button>
		</div>
	);
}

function Instance({ data }) {
	const { size } = data;
	const [grid, setGrid] = useState(generateGrid(data));
	const [activeSquare, setActiveSquare] = useState(null);

	const renderSquare = (square) => {
		const classList =
			"calcudoku-square " +
			square.neighbors.join(" ") +
			(square === activeSquare ? " active" : "");
		return (
			<div className={classList} onClick={() => setActiveSquare(square)}>
				<div className="cage-indicator">
					{square.result}
					{square.operation}
				</div>
				<input type="number" value={square.value || ""} disabled />
			</div>
		);
	};

	const renderNumberSelect = (number) => {
		return (
			<button
				className="number-select"
				key={`num${number}`}
				onClick={() => {
					activeSquare.value = number;
					setGrid([...grid]);
				}}
			>
				{number}
			</button>
		);
	};

	return (
		<div>
			{grid ? (
				<div className="puzzle-container instructions" size={size}>
					<div className="grid-container" size={size}>
						{grid.map(renderSquare)}
					</div>
					{/*
					<div className="number-select-container">
						{new Array(size)
							.fill(null)
							.map((...[, number]) =>
								renderNumberSelect(number + 1)
							)}
					</div>*/}
				</div>
			) : null}
		</div>
	);
}

function generateGrid(puzzleData) {
	const { size, cages, work } = puzzleData;
	const squares = Array(size ** 2).fill(null);
	return squares.map((...[, index]) => {
		const col = Math.floor(index / size);
		const row = index % size;
		const matchSquare = squareMatcher({ col, row });
		const entry = work.find(matchSquare);
		const value = entry ? entry.value : null;
		const cage = cages.find((cage) => cage.squares.find(matchSquare));
		const neighbors = neighborList({ col, row }, cage);
		if (!cage) return { col, row, value, neighbors };
		const isTopLeft = cage.squares.every(
			(square) =>
				square.col >= col && (square.row >= row || square.col > col)
		);
		const result = isTopLeft ? cage.result : null;
		const operation = isTopLeft ? parsedOperations[cage.operation] : null;
		return { col, row, value, neighbors, result, operation };
	});
}

function neighborList(square, cage) {
	const neighbors = [];
	const directions = {
		"n-up": { col: square.col - 1, row: square.row },
		"n-down": { col: square.col + 1, row: square.row },
		"n-left": { col: square.col, row: square.row - 1 },
		"n-right": { col: square.col, row: square.row + 1 },
	};

	if (!cage) return Object.keys(directions);

	for (let dir in directions) {
		const matchSquare = squareMatcher(directions[dir]);
		if (cage.squares.find(matchSquare)) {
			neighbors.push(dir);
		}
	}

	return neighbors;
}

function squareMatcher({ col, row }) {
	return (square) => square.col === col && square.row === row;
}
