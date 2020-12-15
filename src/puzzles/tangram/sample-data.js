const height = 768;
const width = 1024;
const unitLength = 100;
const selectionProximity = 20;
const objectiveCenter = { x: 300, y: 384 };
const startingCenter = { x: 768, y: 384 };
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

const defaultData = {
	objective: [square],
	startingCenter,
	unitLength,
	height,
	width,
	selectionProximity,
	objectiveCenter,
	work: {},
};

export { defaultData };
