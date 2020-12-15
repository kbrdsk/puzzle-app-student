import React, { useState, useMemo, useContext, useEffect } from "react";
import { UserContext } from "../../login/user-context";
import { puzzleData } from "./test-data";
import Controller from "./controller";

export default function Instance(props) {
	const name = useMemo(() => props.name, [props.name]);
	const sessionDataKey = useMemo(() => `tangram-instance-data-${name}`, [
		name,
	]);
	const sessionData = useMemo(
		() => JSON.parse(sessionStorage.getItem(sessionDataKey)),
		[sessionDataKey]
	);
	const [data, setData] = useState(sessionData ? sessionData : puzzleData);
	const [work, setWork] = useState(data.work);
	const [saveStatus, setSaveStatus] = useState(sessionData ? "saved" : null);
	const {
		user: { token },
	} = useContext(UserContext);
	const apiurl = `${process.env.REACT_APP_API_URL}/puzzles/tangram/${name}`;

	useEffect(() => {
		if (!sessionData) {
			(async () => {
				const response = await fetch(apiurl, {
					method: "GET",
					headers: { authorization: token },
				});
				if (response.ok) {
					try {
						const responseData = await response.json();
						sessionStorage.setItem(
							sessionDataKey,
							JSON.stringify(responseData)
						);
						setData(responseData);
						setWork(responseData.work);
						setSaveStatus("saved");
					} catch (error) {
						console.log(error);
					}
				} else console.log("HTTP error, status = " + response.status);
			})();
		}
	}, [apiurl, token, sessionData, sessionDataKey]);

	useEffect(() => {
		const url = `${process.env.REACT_APP_API_URL}/activepuzzle`;
		(async () => {
			await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
				body: JSON.stringify({
					puzzleName: "tangram",
					puzzleId: name,
				}),
			});
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

	const updateWork = async (shapes) => {
		const newWork = {...work};
		for (let shape of shapes) {
			const { name, center, angle } = shape;
			newWork[name] = { center, angle };
		}
		setWork(newWork);
		setSaveStatus("saving");
		const response = await fetch(apiurl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: token,
			},
			body: JSON.stringify({ puzzleData: newWork }),
		});

		const newSessionData = JSON.parse(
			sessionStorage.getItem(sessionDataKey)
		);
		newSessionData.work = newWork;
		sessionStorage.setItem(sessionDataKey, JSON.stringify(newSessionData));

		if (response.ok) setSaveStatus("saved");
		else setSaveStatus("error");
	};

	return (
		<div className="tangram puzzle-container">
			<p className="description">{data.description}</p>
			<Controller data={data} work={work} updateWork={updateWork} />
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
