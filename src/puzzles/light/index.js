import React from "react";
import Instance from "./instance";

const name = "Light Puzzles";
const id = "light";

function ListPreview() {
	return <div className="list-preview">Find all light puzzles here</div>;
}

const instanceList = [
	{ instance: "beginner1", title: "Beginner 1" },
	{ instance: "beginner2", title: "Beginner 2" },
	{ instance: "beginner3", title: "Beginner 3" },
	{ instance: "beginner4", title: "Beginner 4" },
	{ instance: "beginner5", title: "Beginner 5" },
	{ instance: "intermediate1", title: "Intermediate 1" },
	{ instance: "intermediate2", title: "Intermediate 2" },
	{ instance: "intermediate3", title: "Intermediate 3" },
	{ instance: "intermediate4", title: "Intermediate 4" },
	{ instance: "intermediate5", title: "Intermediate 5" },
	{ instance: "expert1", title: "Expert 1" },
	{ instance: "expert2", title: "Expert 2" },
	{ instance: "expert3", title: "Expert 3" },
];

export { name, id, ListPreview, Instance, instanceList };
