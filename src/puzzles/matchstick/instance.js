import React, { useState, useMemo, useContext, useEffect } from "react";
import { UserContext } from "../../login/user-context";
import Canvas from "./canvas";
import puzzleData from "./puzzle-data";

export default function Instance(props) {
	const [sticks, setSticks] = useState(
		puzzleData.startingConfiguration.map((stick) => [...stick])
	);
	return (
		<div className="matchstick puzzle-container">
			<Canvas
				puzzleData={puzzleData}
				sticks={sticks}
				setSticks={setSticks}
			/>
		</div>
	);
}
