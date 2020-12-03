import React from "react";
import List from "./instance-list";
import Instructions from "./instructions";

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

const Instance = List;

export { name, id, ListPreview, instanceList, Instance, Instructions };
