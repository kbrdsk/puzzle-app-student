import React from "react";
import List from "./instance-list";

const name = "Light Puzzles";
const id = "light";

function ListPreview() {
	return <div className="list-preview">Find all light puzzles here</div>;
}

const instanceList = [
	{ instance: "beginner", title: "Beginner" },
	{ instance: "intermediate", title: "Intermediate" },
	{ instance: "expert", title: "Expert" },
];

const Instance = List;

export { name, id, ListPreview, instanceList, Instance };
