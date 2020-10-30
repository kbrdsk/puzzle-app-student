import React from "react";
import Page from "./page";

const name = "Calcudokus";
const id = "calcudoku";
const potd = {
	Preview,
	uri: "/calcudoku/sample",
}

function Preview() {
	return <div className="potd-preview">Like Sudokus, but with a twist!</div>;
}

export function ListPreview() {
	return <div className="list-preview">Find all calcudokus here</div>;
}

export { Page, potd, name, id };
