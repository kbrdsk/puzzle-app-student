import React from "react";
import Instance from "./instance";

const name = "Light Puzzles";
const id = "light";

function ListPreview() {
	return <div className="list-preview">Find all light puzzles here</div>;
}

const instanceSort = () => 1;

export { name, id, ListPreview, instanceSort, Instance };
