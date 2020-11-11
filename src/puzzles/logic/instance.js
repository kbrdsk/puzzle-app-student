import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../login/user-context";

export default function Instance(props) {
	const name = props.name;
	const [description, setDescription] = useState("");
	const [work, setWork] = useState("");
	const {
		user: { token },
	} = useContext(UserContext);
	const apiurl = `${process.env.REACT_APP_API_URL}/puzzles/logic/${name}`;

	useEffect(() => {
		(async () => {
			const response = await fetch(apiurl, {
				method: "GET",
				headers: { authorization: token },
			});
			if (response.ok) {
				try {
					const { description, work } = await response.json();
					setDescription(description);
					setWork(work);
				} catch (error) {
					console.log(error);
				}
			} else console.log("HTTP error, status = " + response.status);
		})();
	}, [apiurl, token, setWork]);

	useEffect(() => {
		const url = `${process.env.REACT_APP_API_URL}/activepuzzle`;
		(async () => {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
				body: JSON.stringify({
					puzzleName: "logic",
					puzzleId: name,
				}),
			});
			console.log(response.status);
		})();

		return () => {
			fetch(url, {
				method: "DELETE",
				headers: {
					authorization: token,
				},
			});
		};
	}, [token, name]);

	const updateWork = async () => {
		const response = await fetch(apiurl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: token,
			},
			body: JSON.stringify({ puzzleData: work }),
		});
		console.log(response.status);
	};

	return (
		<div>
			<p className="puzzle-description">{description}</p>
			<textarea
				className="work"
				onChange={(e) => {
					setWork(e.target.value);
					updateWork();
				}}
				placeholder="Enter your solution or any notes here!"
			/>
		</div>
	);
}