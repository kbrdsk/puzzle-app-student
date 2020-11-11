//import * as Test from "./test/index";
import * as calcudoku from "./calcudoku/index";
import * as logic from "./logic/index";

export const puzzleList = [calcudoku, logic];

export const potd = {
	uri: "/calcudoku/4x4beginner1",
	Preview: POTDPreview,
};

function POTDPreview() {
	return <div className="potd-preview">Like Sudokus, but with a twist!</div>;
}
