import * as Test from "./test/index";
import * as calcudoku from "./calcudoku/index";

export const puzzleList = [calcudoku, Test];

export const potd = {
	uri: "/calcudoku/sample",
	Preview: POTDPreview,
};

function POTDPreview() {
	return <div className="potd-preview">Like Sudokus, but with a twist!</div>;
}
