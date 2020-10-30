import React, { useState, useEffect } from "react";

export default function Page(props) {
	const [solved, setSolved] = useState(false);
	const [workFetched, setWorkFetched] = useState(false);
	const token = props.location.state.token;
	const puzzleUri = `${process.env.REACT_APP_API_URL}/puzzles/Test/0`;
	useEffect(() => {
		if (!workFetched)
			(async () => {
				const response = await fetch(puzzleUri, {
					method: "GET",
					headers: { authorization: token },
				});
				if (response.ok) {
					try {
						const body = await response.json();
						//console.log(body.work);
						setSolved(body.work.solved);
						//console.log(solved);
						setWorkFetched(true);
					} catch (error) {
						console.log(error);
					}
				} else console.log("HTTP error, status = " + response.status);
			})();
	});
	return (
		<div>
			<h1>Test Puzzle</h1>
			{workFetched ? (
				<p>
					<label htmlFor="testsolved">Solved: </label>
					<input
						type="checkbox"
						name="testsolved"
						id="testsolved"
						defaultChecked={solved}
						onClick={(event) => {
							console.log(event.target.checked);
							const isSolved = event.target.checked;
							updateWork(token, { solved: isSolved }, puzzleUri);
							setSolved(isSolved);
						}}
					/>
				</p>
			) : null}
		</div>
	);
}

async function updateWork(token, puzzleData, uri) {
	const response = await fetch(uri, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			authorization: token,
		},
		body: JSON.stringify({ puzzleData }),
	});
	//console.log((await response.json()).work);
}
