import React from "react";
import Page from "./page";

export const name = "Calcudokus";

export const id = "calcudoku";

export { Page };

export function POTDPreview() {
	return <div className="potd-preview">Like Sudokus, but with a twist!</div>;
}

export function ListPreview() {
	return <div className="list-preview">Find all calcudokus here</div>;
}
