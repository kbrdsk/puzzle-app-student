import React, { useRef, useState, useEffect, useCallback } from "react";
import {
	distanceFromSegment,
	distanceFromPoint,
	sum,
	scalarProduct,
	magnitude,
	difference,
} from "../vector-logic";

export default function Canvas(props) {
	const canvasRef = useRef(null);
	const { puzzleData, sticks, setSticks, updateWork } = props;
	const {
		height,
		width,
		selectionProximity,
		startingConfiguration,
		stickLength,
		stickWidth,
	} = puzzleData;
	const [activePoint, setActivePoint] = useState(null);
	const [activeStick, setActiveStick] = useState(null);
	const [mouseLoc, setMouseLoc] = useState({ x: 0, y: 0 });

	const getMouseLoc = (e, locationObject = e) => {
		const rect = e.target.getBoundingClientRect();
		const mouseLocation = {
			x: ((locationObject.clientX - rect.left) / rect.width) * width,
			y: ((locationObject.clientY - rect.top) / rect.height) * height,
		};
		setMouseLoc(mouseLocation);
		return mouseLocation;
	};

	const getPointSelection = useCallback(
		(mouseLocation) => {
			if (activeStick) return;
			const points = sticks.flatMap((stick) => stick);
			return points.reduce(
				(acc, point) => {
					const distance = distanceFromPoint(point, mouseLocation);
					const accDistance = acc
						? distanceFromPoint(mouseLocation, acc)
						: Infinity;
					return distance < Math.min(accDistance, selectionProximity)
						? point
						: acc;
				},

				null
			);
		},
		[sticks, selectionProximity, activeStick]
	);

	const getStickSelection = useCallback(
		(mouseLocation) =>
			activeStick ||
			sticks.reduce(
				(acc, stick) =>
					distanceFromSegment(mouseLocation, stick) <
					Math.min(
						acc
							? distanceFromSegment(mouseLocation, acc)
							: Infinity,
						selectionProximity
					)
						? stick
						: acc,
				null
			),
		[sticks, selectionProximity, activeStick]
	);

	const selectPoint = (mouseLocation) => {
		const selectedPoint = getPointSelection(mouseLocation);
		if (selectedPoint) {
			const selectedStick = sticks.find((stick) =>
				stick.includes(selectedPoint)
			);
			setActivePoint(selectedPoint);
			setActiveStick(selectedStick);
			return selectedPoint;
		}
	};

	const selectStick = (mouseLocation) => {
		const selectedStick = getStickSelection(mouseLocation);
		setActiveStick(selectedStick);
		return selectedStick;
	};

	const select = (mouseLocation) => {
		const selectedPoint = selectPoint(mouseLocation);
		if (!selectedPoint) {
			selectStick(mouseLocation);
		}
	};

	const pointDrag = (mouseLocation) => {
		if (activePoint) {
			const initial = activeStick.find((point) => point !== activePoint);
			const vector = difference(mouseLocation, initial);
			const adjustedVector = scalarProduct(
				vector,
				stickLength / magnitude(vector)
			);
			activePoint.x = initial.x + adjustedVector.x;
			activePoint.y = initial.y + adjustedVector.y;
			setSticks([...sticks]);
		}
	};

	const mouseStickDrag = (e) => {
		if (!activePoint && activeStick) {
			const rect = e.target.getBoundingClientRect();
			for (let i in activeStick) {
				const point = activeStick[i];
				activeStick[i] = {
					x: point.x + (e.movementX * width) / rect.width,
					y: point.y + (e.movementY * height) / rect.height,
				};
			}
			setSticks([...sticks]);
		}
	};

	const touchStickDrag = (touchLocation) => {
		if (!activePoint && activeStick) {
			const stickReference = scalarProduct(sum(...activeStick), 1 / 2);
			const adjustment = {
				x: touchLocation.x - stickReference.x,
				y: touchLocation.y - stickReference.y,
			};
			for (let i in activeStick) {
				const point = activeStick[i];
				activeStick[i] = sum(point, adjustment);
			}
			setSticks([...sticks]);
		}
	};

	const touchHandler = (e) => {
		const touch = e.touches[0];
		const touchLocation = getMouseLoc(e, touch);
		const selectedPoint = selectPoint(touchLocation);
		if (!selectedPoint) {
			selectStick(touchLocation);
		}
	};

	const touchDragHandler = (e) => {
		if (activeStick || activePoint) {
			e.preventDefault();
		}
		const touch = e.touches[0];
		const touchLocation = getMouseLoc(e, touch);
		pointDrag(touchLocation);
		touchStickDrag(touchLocation);
	};

	const mouseMoveHandler = (e) => {
		const mouseLocation = getMouseLoc(e);
		pointDrag(mouseLocation);
		mouseStickDrag(e);
	};

	const mouseDownHandler = (e) => {
		select(getMouseLoc(e));
	};

	const clearSelection = () => {
		setActiveStick(null);
		setActivePoint(null);
	};

	const upHandler = () => {
		updateWork();
		clearSelection();
	};

	const draw = useCallback(
		(ctx) => {
			ctx.clearRect(0, 0, width, height);
			ctx.beginPath();
			ctx.lineWidth = stickWidth;
			ctx.lineCap =
				"round"; /*
			ctx.strokeStyle = "#f5f5f5";
			for (let [initial, terminal] of startingConfiguration) {
				ctx.moveTo(initial.x, initial.y);
				ctx.lineTo(terminal.x, terminal.y);
			}*/
			ctx.stroke();
			for (let [initial, terminal] of sticks) {
				ctx.beginPath();
				ctx.lineWidth = stickWidth;
				ctx.strokeStyle = "#0b032d";
				ctx.moveTo(initial.x, initial.y);
				ctx.lineTo(terminal.x, terminal.y);
				ctx.stroke();
			}
			const pointSelection = getPointSelection(mouseLoc) || activePoint;
			if (pointSelection) {
				ctx.beginPath();
				ctx.arc(
					pointSelection.x,
					pointSelection.y,
					stickWidth * 2,
					0,
					2 * Math.PI
				);
				ctx.fillStyle = "#7354f455";
				ctx.shadowBlur = stickWidth;
				ctx.shadowColor = ctx.fillStyle;
				ctx.fill();
				ctx.shadowBlur = 0;
				ctx.shadowColor = "#0b032d";
			} else {
				const stickSelection =
					getStickSelection(mouseLoc) || activeStick;
				if (stickSelection) {
					const [initial, terminal] = stickSelection;
					ctx.beginPath();
					ctx.strokeStyle = "#7354f455";
					ctx.lineWidth = stickWidth * 3;
					ctx.moveTo(initial.x, initial.y);
					ctx.lineTo(terminal.x, terminal.y);
					ctx.stroke();
				}
			}
		},
		[
			sticks,
			height,
			width,
			startingConfiguration,
			mouseLoc,
			getPointSelection,
			getStickSelection,
			activePoint,
			activeStick,
			stickWidth,
		]
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		draw(context);
	}, [draw]);

	return (
		<canvas
			id="mandelbrot-canvas"
			ref={canvasRef}
			height={height}
			width={width}
			onTouchStart={touchHandler}
			onTouchEnd={upHandler}
			onTouchMove={touchDragHandler}
			onMouseDown={mouseDownHandler}
			onMouseUp={upHandler}
			onMouseLeave={clearSelection}
			onMouseMove={mouseMoveHandler}
			className={
				getStickSelection(mouseLoc) || getPointSelection(mouseLoc)
					? "selecting"
					: ""
			}
		/>
	);
}
