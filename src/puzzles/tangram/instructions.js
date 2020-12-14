import React, { useState, useEffect } from "react";

export default function Instructions({ history }) {
	return (
		<div className="tangram-instructions">
			<h2>
				Tangram Puzzle Instructions
				<hr />
			</h2>
			<p>**TODO**</p>
			<button className="try-it" onClick={() => history.push("/tangram")}>
				Try It!
			</button>
		</div>
	);
}
