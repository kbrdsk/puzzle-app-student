import React, { useState } from "react";

export default function Instance() {
	const [cols, setCols] = useState(4);
	const [rows, setRows] = useState(4);
	const [work, setWork] = useState([]);
	const [neighborType, setNeighborType] = useState("+");

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

	const triggerSquare = (square) => {
		setWork([...work, square]);
	};

	const renderSquare = (row, ...[, col]) => {
		const neighbors = neighborList({ row, col });
		const activatedNeighbors = work.filter((square) =>
			neighbors.some(squareMatcher(square))
		);
		const isActive = activatedNeighbors.length % 2 > 0;
		const classList = `light-square ${isActive ? "active" : "inactive"}`;
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
		</div>
	);
}

function squareMatcher({ row, col }) {
	return (square) => square.col === col && square.row === row;
}
