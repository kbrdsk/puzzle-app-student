import React, { useState, useMemo, useContext, useEffect } from "react";
import { UserContext } from "../../login/user-context";
import { useUpdateActivePuzzle, useUpdateWork } from "../../api-utils.js";
import { defaultData } from "./sample-data";
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
	const [data, setData] = useState(sessionData ? sessionData : defaultData);
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

	useUpdateActivePuzzle("tangram", name);

	const updateWork = useUpdateWork("tangram", name, setSaveStatus);
	const workUpdater = (shapes) => {
		const newWork = { ...work };
		for (let shape of shapes) {
			const { name, center, angle } = shape;
			newWork[name] = { center, angle };
		}
		setWork(newWork);
		updateWork(newWork);
	};

	return (
		<div className="tangram puzzle-container">
			<p className="description">{data.description}</p>
			<Controller
				data={data}
				work={work}
				updateWork={workUpdater}
				saveStatus={saveStatus}
			/>
		</div>
	);
}
