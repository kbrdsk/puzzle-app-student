import React, { useState, useEffect } from "react";

export default function Page(props) {
	const name = "sample";
	const [puzzleData, setPuzzleData] = useState(null);
	const [grid, setGrid] = useState(null);
	const [activeSquare, setActiveSquare] = useState(null);
	const token = props.location.state.token;
	const puzzleUri = `${process.env.REACT_APP_API_URI}/puzzles/calcudoku/${name}`;

	useEffect(() => {
		(async () => {
			const response = await fetch(puzzleUri, {
				method: "GET",
				headers: { authorization: token },
			});
			if (response.ok) {
				try {
					const data = await response.json();
					const gridData = generateGrid(data);
					setPuzzleData(data);
					setGrid(gridData);
				} catch (error) {
					setGrid([]);
					console.log(error);
				}
			} else console.log("HTTP error, status = " + response.status);
		})();
	}, [puzzleUri, token]);

	const updateWork = async () => {
		const work = grid.map((sq) => {
			return { col: sq.col, row: sq.row, value: sq.value };
		});

		const response = await fetch(puzzleUri, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: token,
			},
			body: JSON.stringify({ puzzleData: work }),
		});
		console.log(response.status);
	};

	const downHandler = ({ key }) => {
		if (!isNaN(key) && 1 <= key && key <= puzzleData.size && activeSquare) {
			activeSquare.value = key;
			setGrid([...grid]);
			updateWork();
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", downHandler);
		return () => window.removeEventListener("keydown", downHandler);
	});

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

	return (
		<div>
			<h1>{name.replace(/^./, (char) => char.toUpperCase())}</h1>

			{grid ? (
				<div className="grid-container" size={puzzleData.size}>
					{grid.map(renderSquare)}
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

		const matchSquare = (square) =>
			square.col === col && square.row === row;
		const entry = work.find(matchSquare);
		const cage = cages.find((cage) => cage.squares.find(matchSquare));
		const neighbors = neighborList({ col, row }, cage);
		const isTopLeft = cage.squares.every(
			(square) => square.col >= col && square.row >= row
		);
		const result = isTopLeft ? cage.result : null;
		const operation = isTopLeft ? cage.operation : null;
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
		if (
			cage.squares.find(
				(sq) =>
					sq.col === directions[dir].col &&
					sq.row === directions[dir].row
			)
		)
			neighbors.push(dir);
	}
	return neighbors;
}
