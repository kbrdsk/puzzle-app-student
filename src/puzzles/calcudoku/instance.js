import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../login/user-context";

export default function Instance(props) {
	const name = props.name;
	const [size, setSize] = useState(null);
	const [grid, setGrid] = useState(null);
	const [activeSquare, setActiveSquare] = useState(null);
	const {
		user: { token },
	} = useContext(UserContext);
	const dburl = `${process.env.REACT_APP_API_URL}/puzzles/calcudoku/${name}`;

	useEffect(() => {
		(async () => {
			const response = await fetch(dburl, {
				method: "GET",
				headers: { authorization: token },
			});
			if (response.ok) {
				try {
					const data = await response.json();
					setSize(data.size);
					setGrid(generateGrid(data));
				} catch (error) {
					setGrid([]);
					console.log(error);
				}
			} else console.log("HTTP error, status = " + response.status);
		})();
	}, [dburl, token]);

	useEffect(() => {
		const url = `${process.env.REACT_APP_API_URL}/activepuzzle`;
		(async () => {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
				body: JSON.stringify({
					puzzleName: "calcudoku",
					puzzleId: name,
				}),
			});
			console.log(response.status);
		})();

		return () => {
			fetch(url, {
				method: "DELETE",
				headers: {
					authorization: token,
				},
			});
		};
	}, [token, name]);

	const updateWork = async () => {
		const work = grid.map((sq) => {
			return { col: sq.col, row: sq.row, value: sq.value };
		});

		const response = await fetch(dburl, {
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
			updateWork();
		} else if (
			["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)
		) {
			setActiveSquare(grid.find(squareMatcher({ col: 0, row: 0 })));
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

	const renderNumberSelect = (number) => {
		return (
			<button
				className="number-select"
				key={`num${number}`}
				onClick={() => {
					activeSquare.value = number;
					setGrid([...grid]);
					updateWork();
				}}
			>
				{number}
			</button>
		);
	};

	return (
		<div>
			{grid ? (
				<div className="puzzle-container" size={size}>
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
		const cage = cages.find((cage) => cage.squares.find(matchSquare));
		const neighbors = neighborList({ col, row }, cage);
		const isTopLeft = cage.squares.every(
			(square) =>
				square.col >= col && (square.row >= row || square.col > col)
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
