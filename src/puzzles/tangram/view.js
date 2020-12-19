export default function draw({
	ctx,
	width,
	height,
	objective,
	shapes,
	vertexSelection,
	shapeSelection,
	objectiveCenter,
	unitLength,
}) {
	ctx.clearRect(0, 0, width, height);
	objective.forEach(
		drawObjective.bind(null, ctx, objectiveCenter, unitLength)
	);
	shapes.forEach(drawShape.bind(null, ctx));
	if (vertexSelection) {
		ctx.beginPath();
		ctx.arc(vertexSelection.x, vertexSelection.y, 6, 0, 2 * Math.PI);
		ctx.fillStyle = "#c1b4fa";
		ctx.shadowBlur = 4;
		ctx.shadowColor = ctx.fillStyle;
		ctx.fill();
		ctx.shadowBlur = 0;
		ctx.shadowColor = "#0b032d";
	} else {
		if (shapeSelection) {
			drawShape(ctx, {
				...shapeSelection,
				color: "#c1b4fa",
			});
		}
	}
}

function drawShape(
	ctx,
	{ vertices: [firstVertex, ...vertices], color, center }
) {
	ctx.beginPath();
	ctx.moveTo(firstVertex.x, firstVertex.y);
	vertices.forEach((point) => ctx.lineTo(point.x, point.y));
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

function drawObjective(ctx, objectiveCenter, unitLength, objective) {
	const adjustedObjective = objective.map(([x, y]) => [
		objectiveCenter.x + unitLength * x,
		objectiveCenter.y + unitLength * y,
	]);
	ctx.beginPath();
	const [objectiveStart, ...objectivePoints] = adjustedObjective;
	ctx.moveTo(...objectiveStart);
	objectivePoints.forEach((point) => ctx.lineTo(...point));
	ctx.closePath();
	ctx.fillStyle = "#0b032d";
	ctx.fill();
}
