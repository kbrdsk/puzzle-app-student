import React, { useState, useEffect, useCallback } from "react";
import {
	useUpdateActivePuzzle,
	useUpdateCompleted,
	useUpdateWork,
} from "../../api-utils.js";

const parsedOperations = {
	"-": "-",
	"+": "+",
	"*": "x",
	"/": "÷",
};

export default function Instance({ name }) {
	const sessionDataKey = `calcudoku-instance-data-${name}`;
	const sessionData = JSON.parse(sessionStorage.getItem(sessionDataKey));
	const { size, cages } = sessionData;
	const [grid, setGrid] = useState(generateGrid(sessionData));
	const [activeSquare, setActiveSquare] = useState(null);
	const [saveStatus, setSaveStatus] = useState("saved");
	const updateWork = useUpdateWork("calcudoku", name, setSaveStatus);

	const checkComplete = useCallback(() => {
		const hasCageError = cages.reduce(
			(acc, cage) => hasError(grid, cage) || acc,
			false
		);
		const hasDuplicate = grid.reduce(
			(acc, square) => isDuplicate(grid, square) || acc,
			false
		);

		return !hasCageError && !hasDuplicate;
	}, [grid, cages]);
	
	const workUpdater = () => {
		const work = grid.map((sq) => {
			return { col: sq.col, row: sq.row, value: sq.value };
		});
		updateWork(work);
	};

	const downHandler = ({ key }) => {
		if (activeSquare) {
			if (!isNaN(key) && 1 <= key && key <= size) {
				activeSquare.value = key;
			} else {
				const { col, row } = activeSquare;
				switch (key) {
					case "Backspace":
					case "Delete":
						activeSquare.value = "";
						break;
					case "ArrowUp":
						setActiveSquare(
							grid.find(squareMatcher({ col: col - 1, row })) ||
								activeSquare
						);
						return;
					case "ArrowDown":
						setActiveSquare(
							grid.find(squareMatcher({ col: col + 1, row })) ||
								activeSquare
						);
						return;
					case "ArrowLeft":
						setActiveSquare(
							grid.find(squareMatcher({ col, row: row - 1 })) ||
								activeSquare
						);
						return;
					case "ArrowRight":
						setActiveSquare(
							grid.find(squareMatcher({ col, row: row + 1 })) ||
								activeSquare
						);
						return;
					default:
						return;
				}
			}

			setGrid([...grid]);
			workUpdater();
		} else if (
			["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)
		) {
			setActiveSquare(grid.find(squareMatcher({ col: 0, row: 0 })));
		}
	};

	const renderSquare = (square) => {
		const matchSquare = squareMatcher(square);
		const cage =
			square.result && cages
				? cages.find((cage) => cage.squares.find(matchSquare))
				: null;
		const classList =
			"calcudoku-square " +
			square.neighbors.join(" ") +
			(square === activeSquare ? " active" : "") +
			(name.match("4x4beginner1") && isDuplicate(grid, square)
				? " duplicate"
				: "") +
			((name.match("4x4beginner1") || name.match("4x4beginner2")) &&
			cage &&
			hasError(grid, cage)
				? " cageError"
				: "");
		return (
			<div className={classList} onClick={() => setActiveSquare(square)}>
				<div className="cage-indicator">
					{square.result}
					{square.operation}
				</div>
				<input type="number" value={square.value || ""} disabled />
				<div className="selector"></div>
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
					workUpdater();
				}}
			>
				{number}
			</button>
		);
	};

	useUpdateActivePuzzle("calcudoku", name);
	useUpdateCompleted("calcudoku", name, checkComplete);
	useEffect(() => {
		window.addEventListener("keydown", downHandler);
		return () => window.removeEventListener("keydown", downHandler);
	});

	return (
		<div>
			{grid ? (
				<div className="puzzle-container" size={size}>
					<div className="saving-indicator">
						{saveStatus === "saving"
							? "Saving..."
							: saveStatus === "error"
							? "An error occurred while saving."
							: saveStatus === "saved"
							? "Saved."
							: " "}
					</div>
					<div className="grid-container" size={size}>
						{grid.map(renderSquare)}
					</div>
					<div className="number-select-container">
						{new Array(size)
							.fill(null)
							.map((...[, number]) =>
								renderNumberSelect(number + 1)
							)}
					</div>
				</div>
			) : (
				<h2 className="loading-indicator">Loading...</h2>
			)}
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
		const cage = cages.find((cage) => cage.squares.find(matchSquare));
		const neighbors = neighborList({ col, row }, cage);
		const isTopLeft = cage.squares.every(
			(square) =>
				square.col >= col && (square.row >= row || square.col > col)
		);
		const result = isTopLeft ? cage.result : null;
		const operation = isTopLeft ? parsedOperations[cage.operation] : null;
		const value = entry ? entry.value : null;
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

function isDuplicate(grid, { col, row, value }) {
	return grid.some(
		(square) =>
			(square.row === row || square.col === col) &&
			!(square.row === row && square.col === col) &&
			square.value === value
	);
}

function hasError(grid, { squares, operation, result }) {
	const gridValues = squares.map(
		(square) => +grid.find(squareMatcher(square)).value
	);
	if (gridValues.some((val) => !val)) return false;
	let reducer, startVal;
	switch (operation) {
		case "+":
			startVal = 0;
			reducer = (index) => (a, b) => a + b;
			break;
		case "-":
			startVal = 0;
			reducer = (index) => (a, b, i) => (i === index ? a + b : a - b);
			break;
		case "*":
			startVal = 1;
			reducer = (index) => (a, b) => a * b;
			break;
		case "/":
			startVal = 1;
			reducer = (index) => (a, b, i) => (i === index ? a * b : a / b);
			break;
		default:
			startVal = 0;
			reducer = (index) => (a, b) => b;
	}
	const results = gridValues.map((val, index, gridvals) =>
		gridvals.reduce(reducer(index), startVal)
	);

	return !results.includes(+result);
}
