import React from "react";
import Instructions from "./instructions";
import Instance from "./instance";

const name = "Calcudokus";
const id = "calcudoku";

function ListPreview() {
	return <div className="list-preview">Find all calcudokus here</div>;
}

function instanceSort({ instance: a }, { instance: b }) {
	const [, sizeA, levelA, numberA] = a.match(/^(\d)x\d([a-z]+)(\d+)$/);
	const [, sizeB, levelB, numberB] = b.match(/^(\d)x\d([a-z]+)(\d+)$/);
	if (sizeA < sizeB) return -1;
	if (sizeA > sizeB) return 1;
	if (levelA === "beginner" && ["intermediate", "expert"].includes(levelB))
		return -1;
	if (levelA === "intermediate" && levelB === "expert") return -1;
	if (levelA === levelB && numberA < numberB) return -1;
	return 1;
}

export { name, id, ListPreview, instanceSort, Instructions, Instance };
