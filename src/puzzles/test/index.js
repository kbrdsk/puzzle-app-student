import React from "react";

export function Page(props) {
	return (
		<div>
			<h1>Test Puzzle</h1>
			<p>{props.location.state.token}</p>
		</div>
	);
}

export function POTDPreview() {
	return <div>Test puzzle! Is it solved????</div>;
}

export function ListPreview() {
	return <div>Solved?</div>;
}

export const name = "Test Puzzle";

export const id = "test";
