import React from "react";
import Instance from "./instance";

const name = "Light Puzzles";
const id = "light";

function ListPreview() {
	return <div className="list-preview">Find all light puzzles here</div>;
}

function instanceSort({ instance: a }, { instance: b }) {
	const [, levelA, numberA] = a.match(/^([a-z]+)(\d+)$/);
	const [, levelB, numberB] = b.match(/^([a-z]+)(\d+)$/);
	if (levelA === "beginner" && ["intermediate", "expert"].includes(levelB))
		return -1;
	if (levelA === "intermediate" && levelB === "expert") return -1;
	if (levelA === levelB && numberA < numberB) return -1;
	return 1;
}

export { name, id, ListPreview, instanceSort, Instance };
