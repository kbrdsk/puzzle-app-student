import React from "react";
import Instance from "./instance";

const name = "Logic Puzzles";
const id = "logic";

function ListPreview() {
	return <div className="list-preview">Find all logic puzzles here</div>;
}

const instanceSort = () => 1;

export { name, id, ListPreview, instanceSort, Instance };
