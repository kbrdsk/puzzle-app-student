import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import createTangrams from "./model";
import {
	distanceFromPoint,
	onSameSide,
	difference,
	sum,
} from "../vector-logic";
import draw from "./view";

export default function Controller({ data, work, updateWork, saveStatus }) {
	const canvasRef = useRef(null);
	const {
		height,
		width,
		selectionProximity,
		unitLength,
		objective,
		startingCenter,
		objectiveCenter,
	} = useMemo(() => data, [data]);
	const [activeVertex, setActiveVertex] = useState(null);
	const [activeShape, setActiveShape] = useState(null);
	const [mouseLoc, setMouseLoc] = useState({ x: 0, y: 0 });
	const [shapes, setShapes] = useState(
		createTangrams({ unitLength, startingCenter, work })
	);

	const getMouseLoc = (e, locationObject = e) => {
		const rect = e.target.getBoundingClientRect();
		const mouseLocation = {
			x: ((locationObject.clientX - rect.left) / rect.width) * width,
			y: ((locationObject.clientY - rect.top) / rect.height) * height,
		};
		setMouseLoc(mouseLocation);
		return mouseLocation;
	};

	const getVertexSelection = useCallback(
		(mouseLocation) => {
			if (activeShape) return;
			const points = shapes.flatMap((shape) => shape.vertices);
			return (
				activeVertex ||
				points.reduce(
					(acc, point) => {
						const distance = distanceFromPoint(
							point,
							mouseLocation
						);
						const accDistance = acc
							? distanceFromPoint(mouseLocation, acc)
							: Infinity;
						return distance <
							Math.min(accDistance, selectionProximity)
							? point
							: acc;
					},

					null
				)
			);
		},
		[shapes, activeVertex, activeShape, selectionProximity]
	);

	const getShapeSelection = useCallback(
		(mouseLocation) =>
			activeShape ||
			shapes.reduce(
				(acc, shape) =>
					isInsideShape({ shape, point: mouseLocation })
						? shape
						: acc,
				null
			),
		[shapes, activeShape]
	);

	const selectPoint = (mouseLocation) => {
		const selectedPoint = getVertexSelection(mouseLocation);
		if (selectedPoint) {
			const selectedShape = shapes.find(({ vertices }) =>
				vertices.includes(selectedPoint)
			);
			setActiveVertex(selectedPoint);
			setActiveShape(selectedShape);
			return selectedPoint;
		}
	};

	const selectStick = (mouseLocation) => {
		const selectedShape = getShapeSelection(mouseLocation);
		setActiveShape(selectedShape);
		return selectedShape;
	};

	const select = (mouseLocation) => {
		const selectedPoint = selectPoint(mouseLocation);
		if (!selectedPoint) {
			selectStick(mouseLocation);
		}
	};

	const mouseShapeDrag = (e) => {
		if (!activeVertex && activeShape) {
			const rect = e.target.getBoundingClientRect();
			const center = activeShape.center;
			activeShape.center = {
				x: center.x + (e.movementX * width) / rect.width,
				y: center.y + (e.movementY * height) / rect.height,
			};
			setShapes([...shapes]);
		}
	};

	const touchShapeDrag = (touchLocation) => {
		if (!activeVertex && activeShape) {
			activeShape.center = touchLocation;
			setShapes([...shapes]);
		}
	};

	const pointDrag = (mouseLocation) => {
		if (activeVertex) {
			const { vertices, center } = activeShape;
			const vertexIndex = vertices.indexOf(activeVertex);
			const relVertex = vertices[(vertexIndex + 1) % vertices.length];
			const fixedRelVertex = { x: relVertex.x, y: relVertex.y };
			const relVector = difference(activeVertex, relVertex);
			const startVector = difference(vertices[0], center);
			const angleDifference =
				Math.atan2(relVector.y, relVector.x) -
				Math.atan2(startVector.y, startVector.x);
			const relMouse = difference(mouseLocation, relVertex);
			const mouseAngle = Math.atan2(relMouse.y, relMouse.x);
			activeShape.angle = mouseAngle - angleDifference;
			activeShape.center = sum(
				fixedRelVertex,
				difference(center, relVertex)
			);
			setShapes([...shapes]);
		}
	};

	const snapShape = () => {
		if (activeVertex) {
			const { vertices, center } = activeShape;
			const vertexIndex = vertices.indexOf(activeVertex);
			const relVertex = vertices[(vertexIndex + 1) % vertices.length];
			const fixedRelVertex = { x: relVertex.x, y: relVertex.y };
			const relVector = difference(activeVertex, relVertex);
			const startVector = difference(vertices[0], center);
			const angleDifference =
				Math.atan2(relVector.y, relVector.x) -
				Math.atan2(startVector.y, startVector.x);
			const snapAngle = Math.atan2(relVector.y, relVector.x);
			const snappedAngle = Array.from(
				{ length: 25 },
				(...[, i]) => (Math.PI * i) / 12 - Math.PI
			).find((angle) => Math.abs(snapAngle - angle) <= Math.PI / 23);
			activeShape.angle = snappedAngle - angleDifference;
			activeShape.center = sum(
				fixedRelVertex,
				difference(center, relVertex)
			);
			setShapes([...shapes]);
		}
	};

	const reset = () => {
		const startingPosition = createTangrams({
			unitLength,
			startingCenter,
			work: {},
		});
		setShapes(startingPosition);
		updateWork(startingPosition);
	};

	const clearSelection = () => {
		setActiveShape(null);
		setActiveVertex(null);
	};

	const upHandler = () => {
		snapShape();
		updateWork(shapes);
		clearSelection();
	};

	const mouseMoveHandler = (e) => {
		const mouseLocation = getMouseLoc(e);
		pointDrag(mouseLocation);
		mouseShapeDrag(e);
	};

	const mouseDownHandler = (e) => {
		select(getMouseLoc(e));
	};

	const touchHandler = (e) => {
		const touch = e.touches[0];
		const touchLocation = getMouseLoc(e, touch);
		select(touchLocation);
	};

	const touchDragHandler = (e) => {
		const touch = e.touches[0];
		const touchLocation = getMouseLoc(e, touch);
		pointDrag(touchLocation);
		touchShapeDrag(touchLocation);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		draw({
			ctx,
			shapeSelection: activeShape || getShapeSelection(mouseLoc),
			vertexSelection: activeVertex || getVertexSelection(mouseLoc),
			height,
			width,
			shapes,
			objective,
			objectiveCenter,
			unitLength,
		});
	}, [
		activeShape,
		getShapeSelection,
		activeVertex,
		getVertexSelection,
		height,
		width,
		shapes,
		objective,
		mouseLoc,
		objectiveCenter,
		unitLength,
	]);

	useEffect(() => {
		const preventScroll = (e) =>
			activeShape || activeVertex ? e.preventDefault() : null;
		const canvas = document.querySelector("canvas");
		canvas.addEventListener("touchmove", preventScroll, {
			passive: false,
		});
		return () => canvas.removeEventListener("touchmove", preventScroll);
	}, [activeVertex, activeShape]);

	return (
		<div className="tangram display-container">
			<Reset reset={reset} isactive={true} />
			<canvas
				id="tangram-canvas"
				ref={canvasRef}
				height={height}
				width={width}
				onMouseDown={mouseDownHandler}
				onMouseUp={upHandler}
				onMouseLeave={clearSelection}
				onMouseMove={mouseMoveHandler}
				onTouchStart={touchHandler}
				onTouchEnd={upHandler}
				onTouchMove={touchDragHandler}
				className={
					getShapeSelection(mouseLoc) || getVertexSelection(mouseLoc)
						? "selecting"
						: ""
				}
			/>
			<div className="saving-indicator">
				{saveStatus === "saving"
					? "Saving..."
					: saveStatus === "error"
					? "An error occurred while saving."
					: saveStatus === "saved"
					? "Saved."
					: " "}
			</div>
		</div>
	);
}

function Reset({ reset, isactive }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="2048"
			height="2048"
			viewBox="0 0 2048 2048"
			onClick={reset}
			className="reset nav-button"
			isactive={isactive.toString()}
		>
			<path
				d="M1767 1184q0 5-1 7-64 268-268 434.5t-478 166.5q-146 
      0-282.5-55t-243.5-157l-129 129q-19 19-45 19t-45-19-19-45v-448q0-26 
      19-45t45-19h448q26 0 45 19t19 45-19 45l-137 137q71 66 161 102t187 
      36q134 0 250-65t186-179q11-17 53-117 8-23 30-23h192q13 0 22.5 
      9.5t9.5 22.5zm25-800v448q0 26-19 45t-45 19h-448q-26 0-45-19t-19-45 
      19-45l138-138q-148-137-349-137-134 0-250 65t-186 179q-11 17-53 
      117-8 23-30 23h-199q-13 0-22.5-9.5t-9.5-22.5v-7q65-268 
      270-434.5t480-166.5q146 0 284 55.5t245 156.5l130-129q19-19 45-19t45 
      19 19 45z"
			/>
		</svg>
	);
}

function isInsideShape({ shape: { vertices, center }, point }) {
	return vertices.every((vertex, index, vertices) => {
		const adjacentVertex = vertices[(index + 1) % vertices.length];
		const segment = [
			{ x: vertex.x, y: vertex.y },
			{ x: adjacentVertex.x, y: adjacentVertex.y },
		];
		return onSameSide(point, center, segment);
	});
}
