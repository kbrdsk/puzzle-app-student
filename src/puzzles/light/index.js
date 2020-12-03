import React from "react";
import List from "./instance-list";
import Instructions from "./instructions";
import { fetchUserData } from "../../index";

const name = "Light Puzzles";
const id = "light";

function ListPreview() {
	return <div className="list-preview">Find all light puzzles here</div>;
}

const instanceList = [
	{ instance: "instructions", title: "Instructions" },
	{ instance: "small", title: "Small" },
	{ instance: "medium", title: "Medium" },
	{ instance: "large", title: "Large" },
	{ instance: "smallx", title: "Small-X" },
	{ instance: "mediumx", title: "Medium-X" },
	{ instance: "largex", title: "Large-X" },
];

instanceList.fetchCompletionStatus = async function (user) {
	await fetchUserData(user);
	instanceList.forEach(({ instance }) => {
		if (instance === "instructions") return;
		let completed = true;
		for (let i = 1; i <= 5; i++) {
			const sessionDataKey = `light-instance-data-${instance}${i}`;
			const sessionData = JSON.parse(
				sessionStorage.getItem(sessionDataKey)
			);
			completed = sessionData ? sessionData.completed : false;
		}
		sessionStorage.setItem(
			`light-instance-data-${instance}`,
			JSON.stringify({ completed })
		);
	});
};

const Instance = List;

export { name, id, ListPreview, instanceList, Instance, Instructions };
