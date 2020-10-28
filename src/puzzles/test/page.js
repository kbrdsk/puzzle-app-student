import React, { useState } from "react";

export default function Page(props) {
	const [solved, setSolved] = useState(false);
	return (
		<div>
			<h1>Test Puzzle</h1>
			<p>
				<label htmlFor="testsolved">Solved: </label>
				<input
					type="checkbox"
					name="testsolved"
					id="testsolved"
					defaultChecked={solved}
					onClick={() => {
						setSolved()
					}}
				/>
			</p>
		</div>
	);
}