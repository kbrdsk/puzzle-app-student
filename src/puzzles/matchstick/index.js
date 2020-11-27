import React from "react";
import Instance from "./instance";

const name = "Matchstick Puzzles";
const id = "matchstick";

function ListPreview() {
	return <div className="list-preview">Find all matchtick puzzles here</div>;
}

const instanceList = [{ instance: "fish", title: "Fish" }];

export { name, id, ListPreview, Instance, instanceList };
