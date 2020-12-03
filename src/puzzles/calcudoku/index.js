import React from "react";
import Instructions from "./instructions";
import Instance from "./instance";
import { fetchUserData } from "../../index";

const name = "Calcudokus";
const id = "calcudoku";

function ListPreview() {
	return <div className="list-preview">Find all calcudokus here</div>;
}

const instanceList = [
	{ instance: "instructions", title: "Instructions" },
	{ instance: "4x4beginner1", title: "4x4 Beginner 1" },
	{ instance: "4x4beginner2", title: "4x4 Beginner 2" },
	{ instance: "4x4beginner3", title: "4x4 Beginner 3" },
	{ instance: "4x4intermediate1", title: "4x4 Intermediate 1" },
	{ instance: "4x4intermediate2", title: "4x4 Intermediate 2" },
	{ instance: "4x4expert1", title: "4x4 Expert 1" },
	{ instance: "5x5beginner1", title: "5x5 Beginner 1" },
];

instanceList.fetchCompletionStatus = fetchUserData;

export { name, id, ListPreview, Instructions, Instance, instanceList };
