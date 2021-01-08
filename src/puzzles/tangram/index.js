import React from "react";
import Instance from "./instance";
import Instructions from "./instructions";
import { fetchUserData } from "../../api-utils";

const name = "Tangrams";
const id = "tangram";

function ListPreview() {
	return <div className="list-preview">Find all tangram puzzles here</div>;
}

const instanceList = [
	{ instance: "instructions", title: "Instructions" },
	{ instance: "triangle", title: "Triangle" },
	{ instance: "rectangle", title: "Rectangle" },
	{ instance: "trapezoid", title: "Trapezoid" },
	{ instance: "twotriangles", title: "Two Triangles" },
	{ instance: "twosquares", title: "Two Squares" },
	{ instance: "cube", title: "Cube" },
	{ instance: "hexagon", title: "Hexagon" },
	{ instance: "incompleterectangle", title: "Incomplete Rectangle" },
];

instanceList.fetchCompletionStatus = fetchUserData;

export { name, id, ListPreview, Instance, instanceList, Instructions };
