import React from "react";
import Page from "./page";

export const name = "Test Puzzle";

export const id = "test";

export { Page };

export function POTDPreview() {
	return <div className="potd-preview">Test puzzle! Is it solved????</div>;
}

export function ListPreview() {
	return <div className="list-preview">Solved?</div>;
}
