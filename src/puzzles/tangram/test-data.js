const height = 768;
const width = 1024;
const unitLength = 100;
const selectionProximity = 20;
const objectiveCenter = { x: 300, y: 384 };
const startingCenter = { x: 768, y: 384 };
const puzzleId = "hexagon";
const triangle = [
	[-2 * Math.sqrt(2), +Math.sqrt(2)],
	[2 * Math.sqrt(2), +Math.sqrt(2)],
	[0, -Math.sqrt(2)],
];
const square = [
	[-Math.sqrt(2), -Math.sqrt(2)],
	[Math.sqrt(2), -Math.sqrt(2)],
	[Math.sqrt(2), Math.sqrt(2)],
	[-Math.sqrt(2), Math.sqrt(2)],
];
const objectives = {
	triangle: [triangle],

	rectangle: [
		[
			[-2, 1],
			[-2, -1],
			[2, -1],
			[2, 1],
		],
	],

	trapezoid: [
		[
			[-3, 1],
			[-1, -1],
			[1, -1],
			[3, 1],
		],
	],

	twoTriangles: [
		triangle.map(([x, y]) => [x / Math.sqrt(2), y / Math.sqrt(2) + 1.2]),
		triangle.map(([x, y]) => [x / Math.sqrt(2), y / Math.sqrt(2) - 1.2]),
	],

	twoSquares: [
		square.map(([x, y]) => [
			x / Math.sqrt(2) + 1.2,
			y / Math.sqrt(2) + 1.2,
		]),
		square.map(([x, y]) => [
			x / Math.sqrt(2) - 1.2,
			y / Math.sqrt(2) - 1.2,
		]),
	],

	cube: [
		[
			[-3 / 2, 3 / 2],
			[-3 / 2, -1 / 2],
			[-1 / 2, -3 / 2],
			[3 / 2, -3 / 2],
			[3 / 2, 1 / 2],
			[1 / 2, 3 / 2],
		],
	],

	hexagon: [
		[
			[-1, 3 / 2],
			[-1, -3 / 2],
			[0, -5 / 2],
			[1, -3 / 2],
			[1, 3 / 2],
			[0, 5 / 2],
		],
	],

	incompleteSquare: [
		[
			[-Math.sqrt(2), 3 / 2],
			[-Math.sqrt(2), -3 / 2],
			[Math.sqrt(2), -3 / 2],
			[Math.sqrt(2), 3 / 2],
			[Math.sqrt(2) - 1, 1 / 2],
			[Math.sqrt(2) - 1, -1 / 2],
			[0, -3 / 2 + Math.sqrt(2)],
			[-Math.sqrt(2) + 1, -1 / 2],
			[-Math.sqrt(2) + 1, 1 / 2],
			[0, 3 / 2 - Math.sqrt(2)],
			[Math.sqrt(2), 3 / 2],
		],
	],
};

const puzzleData = {
	puzzleId,
	objective: objectives[puzzleId].map((shape) =>
		shape.map(([x, y]) => [
			objectiveCenter.x + unitLength * x,
			objectiveCenter.y + unitLength * y,
		])
	),
	startingCenter,
	unitLength,
	height,
	width,
	selectionProximity,
	work: {},
};

export { puzzleData };
