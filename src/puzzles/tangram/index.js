import React from "react";
import Instance from "./instance";
import Instructions from "./instructions";
import { fetchUserData } from "../../index";

const name = "Tangram Puzzles";
const id = "tangram";

function ListPreview() {
	return <div className="list-preview">Find all tangram puzzles here</div>;
}

const instanceList = [
	{ instance: "instructions", title: "Instructions" },
	{ instance: "sample", title: "Sample" },
];

instanceList.fetchCompletionStatus = fetchUserData;

export { name, id, ListPreview, Instance, instanceList, Instructions };
