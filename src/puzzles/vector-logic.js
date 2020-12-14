function orthogonalVector(vector) {
  return { x: vector.y, y: -vector.x };
}

export function distanceFromSegment(point, [initial, terminal]) {
  const orthogonal = orthogonalVector({
    x: terminal.x - initial.x,
    y: terminal.y - initial.y,
  });
  const initialLine = [initial, sum(initial, orthogonal)];
  const terminalLine = [terminal, sum(terminal, orthogonal)];
  const isBetweenEndpoints =
    distanceFromLine(point, initialLine) +
      distanceFromLine(point, terminalLine) <=
    distanceFromPoint(initial, terminal) + 1;

  const distance = isBetweenEndpoints
    ? distanceFromLine(point, [initial, terminal])
    : Math.min(
        distanceFromPoint(point, initial),
        distanceFromPoint(point, terminal)
      );
  return distance;
}

export function distanceFromPoint(pointA, pointB) {
  return magnitude(difference(pointA, pointB));
}

function distanceFromLine(point, [initial, terminal]) {
  const lineVector = difference(initial, terminal);
  const pointVector = difference(point, initial);
  return (
    Math.abs(lineVector.x * pointVector.y - lineVector.y * pointVector.x) /
    magnitude(lineVector)
  );
}

export function difference(vectorA, vectorB) {
  return { x: vectorA.x - vectorB.x, y: vectorA.y - vectorB.y };
}

export function sum(vectorA, vectorB) {
  return { x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y };
}

export function scalarProduct(vector, scalar) {
  return { x: vector.x * scalar, y: vector.y * scalar };
}

export function magnitude(vector) {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

function dotProduct(vector1, vector2) {
  return vector1.x * vector2.x + vector1.y * vector2.y;
}