import React from "react";
import Instance from "./instance";
import Instructions from "./instructions";
import { fetchUserData } from "../../index";

const name = "Matchstick Puzzles";
const id = "matchstick";

function ListPreview() {
	return <div className="list-preview">Find all matchtick puzzles here</div>;
}

const instanceList = [
	{ instance: "instructions", title: "Instructions" },
	{ instance: "fish", title: "Fish" },
	{ instance: "squares1", title: "Squares 1" },
	{ instance: "squares2", title: "Squares 2" },
	{ instance: "squares3", title: "Squares 3" },
	{ instance: "donkey", title: "Donkey" },
	{ instance: "squares4", title: "Squares 4" },
	{ instance: "squares5", title: "Squares 5" },
];

instanceList.fetchCompletionStatus = fetchUserData;

export { name, id, ListPreview, Instance, instanceList, Instructions };
